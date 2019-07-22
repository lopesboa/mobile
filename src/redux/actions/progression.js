// @flow strict

import {
  createProgression,
  CONTENT_TYPE,
  selectProgression,
  getCurrentProgressionId
} from '@coorpacademy/player-store';
import type {Level, Chapter} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI} from '@coorpacademy/player-services';
import type {
  Engine,
  EngineConfig,
  GenericContent,
  Progression
} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';
import pMap from 'p-map';

import {getMostAccurateRef} from '../../modules/reference';
import type {StoreAction, ErrorAction} from '../_types';
import {getToken, getBrand} from '../utils/state-extract';
import {isDone} from '../../utils/progressions';
import {ENGINE} from '../../const';
import type {RestrictedResourceType} from '../../layer/data/_types';
import {RESTRICTED_RESOURCE_TYPE} from '../../layer/data/_const';

const ENGINE_VERSION = '1';
const ENGINE_CONFIG_VERSION = '1';

export const SYNCHRONIZE_REQUEST = '@@progression/SYNCHRONIZE_REQUEST';
export const SYNCHRONIZE_SUCCESS = '@@progression/SYNCHRONIZE_SUCCESS';
export const SYNCHRONIZE_FAILURE = '@@progression/SYNCHRONIZE_FAILURE';
export const CREATE_NEXT_REQUEST = '@@progression/CREATE_NEXT_REQUEST';
export const CREATE_NEXT_SUCCESS = '@@progression/CREATE_NEXT_SUCCESS';
export const CREATE_NEXT_FAILURE = '@@progression/CREATE_NEXT_FAILURE';

export {selectProgression};

export const selectCurrentProgression = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const progressionId = getCurrentProgressionId(state);

  if (progressionId) {
    dispatch(selectProgression(progressionId));
  }
};

export const createLevelProgression = (level: Level) => {
  const ref = getMostAccurateRef(level);
  const engine: Engine = {ref: ENGINE.LEARNER, version: ENGINE_VERSION};
  // @todo use universalRef
  const content: GenericContent = {type: CONTENT_TYPE.LEVEL, ref};
  const engineConfig: EngineConfig = {
    version: ENGINE_CONFIG_VERSION,
    livesDisabled: level.infiniteLives
  };

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};

export const createChapterProgression = (chapter: Chapter) => {
  const engine: Engine = {ref: ENGINE.MICROLEARNING, version: ENGINE_VERSION};
  const ref = getMostAccurateRef(chapter);
  const content: GenericContent = {type: CONTENT_TYPE.CHAPTER, ref};
  const engineConfig: EngineConfig = {version: ENGINE_CONFIG_VERSION};

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};

export type Action =
  | {|
      type: typeof SYNCHRONIZE_REQUEST,
      meta: {|id: string|}
    |}
  | {|
      type: typeof SYNCHRONIZE_SUCCESS,
      meta: {|id: string|}
    |}
  | ErrorAction<{|
      type: typeof SYNCHRONIZE_FAILURE,
      meta: {|id: string|}
    |}>;

export const synchronizeProgression = (progressionId: string): StoreAction<Action> => {
  return async (dispatch, getState, options) => {
    await dispatch({
      type: SYNCHRONIZE_REQUEST,
      meta: {id: progressionId}
    });

    const state = getState();
    const token = getToken(state);
    const brand = getBrand(state);

    const {services} = options;

    try {
      if (token === null) throw new TypeError('Token not defined');
      if (brand === null) throw new TypeError('Brand not defined');

      const progression = await services.Progressions.findById(progressionId);
      if (progression) await services.Progressions.synchronize(token, brand.host, progression);

      return dispatch({
        type: SYNCHRONIZE_SUCCESS,
        meta: {id: progressionId}
      });
    } catch (err) {
      return dispatch({
        type: SYNCHRONIZE_FAILURE,
        error: true,
        payload: err,
        meta: {id: progressionId}
      });
    }
  };
};

export type NextProgressionAction =
  | {|
      type: typeof CREATE_NEXT_REQUEST,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}
  | {|
      type: typeof CREATE_NEXT_SUCCESS,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}
  | ErrorAction<{|
      type: typeof CREATE_NEXT_FAILURE,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}>;

export const createNextProgression = (
  type: RestrictedResourceType,
  ref: string
): StoreAction<NextProgressionAction> => async (dispatch, getState, options) => {
  const {services} = options;

  await dispatch({
    type: CREATE_NEXT_REQUEST,
    meta: {type, ref}
  });

  try {
    if (![CONTENT_TYPE.CHAPTER, CONTENT_TYPE.LEVEL].includes(type)) {
      throw new Error(`content type ${type} is not handled`);
    }

    const lastProgression: Progression | null = await services.Progressions.findLast(
      type === RESTRICTED_RESOURCE_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER,
      ref
    );

    if (lastProgression && lastProgression._id) {
      // $FlowFixMe wrong action
      return dispatch(selectProgression(lastProgression._id));
    }

    if (type === RESTRICTED_RESOURCE_TYPE.CHAPTER) {
      // $FlowFixMe union type
      const chapter: ChapterAPI = await services.Content.find(type, ref);

      // $FlowFixMe await on dispatched action
      const {payload: progression}: {payload: Progression} = await dispatch(
        // $FlowFixMe wrong action
        createChapterProgression(chapter)
      );
      // $FlowFixMe wrong thunk action
      await dispatch(selectProgression(progression._id));
    }

    if (type === RESTRICTED_RESOURCE_TYPE.LEVEL) {
      // $FlowFixMe union type
      const level: LevelAPI = await services.Content.find(type, ref);

      // $FlowFixMe await on dispatched action
      const {payload: progression}: {payload: Progression} = await dispatch(
        // $FlowFixMe wrong action
        createLevelProgression(level)
      );
      // $FlowFixMe wrong thunk action
      await dispatch(selectProgression(progression._id));
    }

    return dispatch({
      type: CREATE_NEXT_SUCCESS,
      meta: {type, ref}
    });
  } catch (e) {
    return dispatch({
      type: CREATE_NEXT_FAILURE,
      payload: e,
      error: true,
      meta: {type, ref}
    });
  }
};

export const synchronizeProgressions: StoreAction<Action> = async (dispatch, getState, options) => {
  const {services} = options;

  const progressions = await services.Progressions.getAll();
  await pMap(
    progressions.filter(isDone),
    (progression): Promise<Action | void> => {
      const {_id} = progression;
      if (_id) {
        return dispatch(synchronizeProgression(_id));
      }
      return Promise.resolve();
    },
    {concurrency: 1}
  );

  return;
};
