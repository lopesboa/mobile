// @flow strict

import {createProgression, CONTENT_TYPE, selectProgression} from '@coorpacademy/player-store';
import type {Level, Chapter} from '@coorpacademy/player-store';
import type {Engine, EngineConfig, GenericContent} from '@coorpacademy/progression-engine';
import {ObjectId} from 'bson';
import pMap from 'p-map';
import type {StoreAction} from '../_types';
import {getToken, getBrand} from '../utils/state-extract';
import {isDone} from '../../utils/progressions';

import {ENGINE} from '../../const';

const ENGINE_VERSION = '1';
const ENGINE_CONFIG_VERSION = '1';

export {selectProgression};

export const createLevelProgression = (level: Level) => {
  const engine: Engine = {ref: ENGINE.LEARNER, version: ENGINE_VERSION};
  // @todo use universalRef
  const content: GenericContent = {type: CONTENT_TYPE.LEVEL, ref: level.ref};
  const engineConfig: EngineConfig = {
    version: ENGINE_CONFIG_VERSION,
    livesDisabled: level.infiniteLives
  };

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};

export const createChapterProgression = (chapter: Chapter) => {
  const engine: Engine = {ref: ENGINE.MICROLEARNING, version: ENGINE_VERSION};
  const content: GenericContent = {type: CONTENT_TYPE.CHAPTER, ref: chapter.universalRef};
  const engineConfig: EngineConfig = {version: ENGINE_CONFIG_VERSION};

  return createProgression(new ObjectId().toString(), engine, content, engineConfig);
};

export type Action =
  | {|
      type: '@@progression/SYNCHRONIZE_REQUEST',
      meta: {|id: string|}
    |}
  | {|
      type: '@@progression/SYNCHRONIZE_SUCCESS',
      meta: {|id: string|}
    |}
  | {|
      type: '@@progression/SYNCHRONIZE_FAILURE',
      error: true,
      payload: Error,
      meta: {|id: string|}
    |};

export const synchronizeProgression = (progressionId: string): StoreAction<Action> => {
  return async (dispatch, getState, options) => {
    await dispatch({
      type: '@@progression/SYNCHRONIZE_REQUEST',
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
        type: '@@progression/SYNCHRONIZE_SUCCESS',
        meta: {id: progressionId}
      });
    } catch (err) {
      return dispatch({
        type: '@@progression/SYNCHRONIZE_FAILURE',
        error: true,
        payload: err,
        meta: {id: progressionId}
      });
    }
  };
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
