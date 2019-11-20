// @flow

import pMap from 'p-map';
import type {Progression} from '@coorpacademy/progression-engine';
import type {StoreAction, StoreErrorAction} from '../../_types';
import {getToken, getBrand} from '../../utils/state-extract';

import {ForbiddenError} from '../../../models/error';
import {
  isAlreadySynchronized,
  isDone,
  sortProgressionChronologicaly
} from '../../../utils/progressions';

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
  | StoreErrorAction<{|
      type: typeof SYNCHRONIZE_FAILURE,
      meta: {|id: string|}
    |}>;

export const synchronizeProgressions: StoreAction<Action> = async (dispatch, getState, options) => {
  const {services} = options;
  const state = getState();
  const token = getToken(state);
  const brand = getBrand(state);

  if (token === null) throw new TypeError('Token not defined');
  if (brand === null) throw new TypeError('Brand not defined');

  const progressions = await services.Progressions.getAll();
  const synchronizedProgressionsIds: Array<string> = await services.Progressions.getSynchronizedProgressionIds();

  const syncProgression = async (progression: Progression, numberOfRetries?: number = 5) => {
    try {
      await services.Progressions.synchronize(token, brand.host, progression);
      // $FlowFixMe here the progression will always have an id cause we check before calling the function
      synchronizedProgressionsIds.push(progression._id);
    } catch (error) {
      if (error instanceof ForbiddenError) throw new Error(error);
      if (numberOfRetries > 0) {
        return syncProgression(progression, numberOfRetries - 1);
      }
      throw error;
    }
  };

  await pMap(
    sortProgressionChronologicaly(progressions).filter(
      p => isDone(p) && !isAlreadySynchronized(p, synchronizedProgressionsIds)
    ),
    async (progression): Promise<Action | void> => {
      const {_id} = progression;

      if (_id) {
        try {
          await syncProgression(progression);
          return dispatch({
            type: SYNCHRONIZE_SUCCESS,
            meta: {id: _id}
          });
        } catch (err) {
          return dispatch({
            type: SYNCHRONIZE_FAILURE,
            error: true,
            payload: err,
            meta: {id: _id}
          });
        }
      }
      return Promise.resolve();
    },
    {concurrency: 1}
  );

  await services.Progressions.updateSynchronizedProgressionIds(synchronizedProgressionsIds);
  return;
};
