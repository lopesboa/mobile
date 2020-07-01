import pMap from 'p-map';
import delay from 'delay';
import type {Progression} from '@coorpacademy/progression-engine';
import type {StoreAction, StoreErrorAction} from '../../_types';
import {getToken, getBrand, isProgressionsSynchronizing} from '../../utils/state-extract';

import {ForbiddenError, ConflictError} from '../../../models/error';
import {
  isAlreadySynchronized,
  isDone,
  sortProgressionChronologicaly,
} from '../../../utils/progressions';

export const SYNCHRONIZE_REQUEST = '@@progression/SYNCHRONIZE_REQUEST';
export const SYNCHRONIZE_SUCCESS = '@@progression/SYNCHRONIZE_SUCCESS';
export const SYNCHRONIZE_FAILURE = '@@progression/SYNCHRONIZE_FAILURE';

export type Action =
  | {
      type: typeof SYNCHRONIZE_REQUEST;
    }
  | {
      type: typeof SYNCHRONIZE_SUCCESS;
    }
  | StoreErrorAction<{
      type: typeof SYNCHRONIZE_FAILURE;
    }>;

export const synchronizeRequest = (): Action => ({
  type: SYNCHRONIZE_REQUEST,
});
export const synchronizeSuccess = (): Action => ({
  type: SYNCHRONIZE_SUCCESS,
});
export const synchronizeFailure = (): Action => ({
  type: SYNCHRONIZE_FAILURE,
});

export const synchronizeProgression = (
  id: string,
  progression: Progression,
  numberOfRetries = 5,
): StoreAction<Action> => async (dispatch, getState, options) => {
  const {services} = options;

  try {
    const state = getState();
    const token = getToken(state);
    const brand = getBrand(state);

    if (token === null) throw new TypeError('Token not defined');
    if (brand === null) throw new TypeError('Brand not defined');

    await dispatch(synchronizeRequest());
    const remoteProgressionExists = await services.Progressions.findRemoteProgressionById(
      token,
      brand.host,
      id,
    );
    if (!remoteProgressionExists)
      await services.Progressions.synchronize(token, brand.host, progression);
    return dispatch(synchronizeSuccess());
  } catch (e) {
    if (e instanceof ConflictError) {
      return dispatch(synchronizeFailure());
    }
    if (e instanceof ForbiddenError) {
      if (numberOfRetries > 0) {
        await delay(2000);
        await dispatch(synchronizeFailure());
        // @ts-ignore don't need to be dispatched
        return synchronizeProgression(id, progression, numberOfRetries - 1)(
          dispatch,
          getState,
          options,
        );
      }
      await dispatch(synchronizeFailure());
      throw new Error('Progression post failed after 5 retries');
    }
    await dispatch(synchronizeFailure());
    throw e;
  }
};

export const SYNCHRONIZE_ALL_REQUEST = '@@progression/SYNCHRONIZE_ALL_REQUEST';
export const SYNCHRONIZE_ALL_SUCCESS = '@@progression/SYNCHRONIZE_ALL_SUCCESS';
export const SYNCHRONIZE_ALL_FAILURE = '@@progression/SYNCHRONIZE_ALL_FAILURE';

export type AllAction =
  | {
      type: typeof SYNCHRONIZE_ALL_REQUEST;
    }
  | {
      type: typeof SYNCHRONIZE_ALL_SUCCESS;
    }
  | StoreErrorAction<{
      type: typeof SYNCHRONIZE_ALL_FAILURE;
    }>;

export const synchronizeAllRequest = (): AllAction => ({
  type: SYNCHRONIZE_ALL_REQUEST,
});
export const synchronizeAllSuccess = (): AllAction => ({
  type: SYNCHRONIZE_ALL_SUCCESS,
});
export const synchronizeAllFailure = (): AllAction => ({
  type: SYNCHRONIZE_ALL_FAILURE,
});

export const synchronizeProgressions: StoreAction<Action> = async (dispatch, getState, options) => {
  try {
    const {services} = options;
    const state = getState();
    const isSynchronizing = isProgressionsSynchronizing(state);
    if (isSynchronizing) return;

    await dispatch(synchronizeAllRequest());

    const progressions = await services.Progressions.getAll();
    const synchronizedProgressionsIds: Array<string> = await services.Progressions.getSynchronizedProgressionIds();

    await pMap(
      sortProgressionChronologicaly(progressions).filter(
        (p) => isDone(p) && !isAlreadySynchronized(p, synchronizedProgressionsIds),
      ),
      async (progression): Promise<Action | void> => {
        const {_id} = progression;
        if (_id) {
          await dispatch(synchronizeProgression(_id, progression));
          synchronizedProgressionsIds.push(_id);
          await services.Progressions.updateSynchronizedProgressionIds(synchronizedProgressionsIds);
        }
        return Promise.resolve();
      },
      {concurrency: 1},
    );
    return dispatch(synchronizeAllSuccess());
  } catch (e) {
    return dispatch(synchronizeAllFailure());
  }
};
