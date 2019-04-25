// @flow strict

import type {Brand} from '../../types';
import type {StoreAction} from '../_types';
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
  | {|
      type: '@@brands/FETCH_ERROR',
      payload: {|
        error: string
      |}
    |};

export const fetchRequest = (): Action => ({
  type: FETCH_REQUEST
});

export const fetchSuccess = (item: Brand): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    item
  }
});

export const fetchError = (error: string): Action => ({
  type: FETCH_ERROR,
  payload: {
    error
  }
});

export const fetchBrand = (token: string): StoreAction<Action> => async (
  dispatch,
  getState,
  {services}
) => {
  await dispatch(fetchRequest());

  if (!token) {
    return dispatch(fetchError('Token not defined'));
  }

  try {
    const brand = await services.Brands.find(token);

    return dispatch(fetchSuccess(brand));
  } catch (e) {
    return dispatch(fetchError(e.message));
  }
};

export const fetchCurrentBrand = (): StoreAction<Action> => (dispatch, getState, options) => {
  const token = getToken(getState());
  // $FlowFixMe wrong StoreAction type
  return fetchBrand(token)(dispatch, getState, options);
};
