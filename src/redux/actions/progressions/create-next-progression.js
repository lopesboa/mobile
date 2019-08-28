// @flow strict

import {CONTENT_TYPE, selectProgression} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI} from '@coorpacademy/player-services';
import type {Progression} from '@coorpacademy/progression-engine';

import type {StoreAction, ErrorAction} from '../../_types';
import {ENGINE} from '../../../const';
import type {RestrictedResourceType} from '../../../layer/data/_types';
import {RESTRICTED_RESOURCE_TYPE} from '../../../layer/data/_const';
import {getEngineVersions} from '../../utils/state-extract';
import {createChapterProgression} from './create-chapter-progression';
import {createLevelProgression} from './create-level-progression';

export const CREATE_NEXT_REQUEST = '@@progression/CREATE_NEXT_REQUEST';
export const CREATE_NEXT_SUCCESS = '@@progression/CREATE_NEXT_SUCCESS';
export const CREATE_NEXT_FAILURE = '@@progression/CREATE_NEXT_FAILURE';

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

    const state = getState();
    const engineConfig = getEngineVersions(state);

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
        createChapterProgression(chapter, engineConfig && engineConfig.versions.microlearning)
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
        createLevelProgression(level, engineConfig && engineConfig.versions.learner)
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
