// @flow strict

import type {Brand} from '../../types';
import type {StoreAction, ErrorAction} from '../_types';
import {getToken} from '../utils/state-extract';

export const FETCH_REQUEST = `@@brands/FETCH_REQUEST`;
export const FETCH_SUCCESS = `@@brands/FETCH_SUCCESS`;
export const FETCH_ERROR = `@@brands/FETCH_ERROR`;

export type Action =
  | {|
      type: '@@brands/FETCH_REQUEST'
    |}
  | {|
      type: '@@brands/FETCH_SUCCESS',
      payload: {|
        item: Brand
      |}
    |}
  | ErrorAction<{|
      type: '@@brands/FETCH_ERROR'
    |}>;

export const fetchRequest = (): Action => ({
  type: FETCH_REQUEST
});

export const fetchSuccess = (item: Brand): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    item
  }
});

export const fetchError = (e: Error): Action => ({
  type: FETCH_ERROR,
  payload: e,
  error: true
});

export const fetchBrand = (token: string): StoreAction<Action> => async (
  dispatch,
  getState,
  {services}
) => {
  try {
    await dispatch(fetchRequest());
    if (!token) {
      throw new Error('Token not defined');
    }
    const brand = await services.Brands.find(token);

    return dispatch(fetchSuccess(brand));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};

export const fetchCurrentBrand = (): StoreAction<Action> => (dispatch, getState, options) => {
  const token = getToken(getState());
  // $FlowFixMe wrong StoreAction type
  return fetchBrand(token)(dispatch, getState, options);
};
