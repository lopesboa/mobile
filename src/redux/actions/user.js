// @flow strict

import type {User} from '../../types';
import type {StoreAction, StoreErrorAction} from '../_types';

export const FETCH_REQUEST = `@@users/FETCH_REQUEST`;
export const FETCH_SUCCESS = `@@users/FETCH_SUCCESS`;
export const FETCH_ERROR = `@@users/FETCH_ERROR`;

export type Action =
  | {|
      type: '@@users/FETCH_REQUEST'
    |}
  | {|
      type: '@@users/FETCH_SUCCESS',
      payload: User
    |}
  | StoreErrorAction<{|
      type: '@@users/FETCH_ERROR'
    |}>;

export const fetchRequest = (): Action => ({
  type: FETCH_REQUEST
});

export const fetchSuccess = (item: User): Action => ({
  type: FETCH_SUCCESS,
  payload: item
});

export const fetchError = (e: Error): Action => ({
  type: FETCH_ERROR,
  payload: e,
  error: true
});

export const fetchUser = (token: string): StoreAction<Action> => async (
  dispatch,
  getState,
  {services}
) => {
  try {
    await dispatch(fetchRequest());
    if (!token) {
      throw new Error('Token not defined');
    }
    const user = await services.Users.find(token);

    return dispatch(fetchSuccess(user));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};
