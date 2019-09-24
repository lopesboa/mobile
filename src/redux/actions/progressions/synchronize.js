// @flow strict

import pMap from 'p-map';

import type {StoreAction, ErrorAction} from '../../_types';
import {getToken, getBrand} from '../../utils/state-extract';
import {isDone, sortProgressionChronologicaly} from '../../../utils/progressions';

export const SYNCHRONIZE_REQUEST = '@@progression/SYNCHRONIZE_REQUEST';
export const SYNCHRONIZE_SUCCESS = '@@progression/SYNCHRONIZE_SUCCESS';
export const SYNCHRONIZE_FAILURE = '@@progression/SYNCHRONIZE_FAILURE';

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

export const synchronizeProgressions: StoreAction<Action> = async (dispatch, getState, options) => {
  const {services} = options;

  const progressions = await services.Progressions.getAll();
  await pMap(
    sortProgressionChronologicaly(progressions).filter(isDone),
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
