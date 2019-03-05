// @flow strict

import type {Brand} from '../../types';

export const FETCH_REQUEST = `@@brands/FETCH_REQUEST`;
export const FETCH_SUCCESS = `@@brands/FETCH_SUCCESS`;
export const FETCH_ERROR = `@@brands/FETCH_ERROR`;
export const SELECT_CARD = '@@brands/SELECT_CARD';
export const SELECT_CARD_FAILURE = '@@brands/SELECT_CARD_FAILURE';

export type FetchRequestPayload = {|token: string|};

export type FetchSuccessPayload = {|
  item: Brand,
  token: string
|};

export type FetchErrorPayload = {|
  error: string
|};

export type Action =
  | {|
      type: typeof FETCH_REQUEST,
      payload: FetchRequestPayload
    |}
  | {|
      type: typeof FETCH_SUCCESS,
      payload: FetchSuccessPayload
    |}
  | {|
      type: typeof FETCH_ERROR,
      payload: FetchErrorPayload
    |};

export const fetchRequest = (token: string): Action => ({
  type: FETCH_REQUEST,
  payload: {
    token
  }
});

export const fetchSuccess = (item: Brand, token: string): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    item,
    token
  }
});

export const fetchError = (error: string): Action => ({
  type: FETCH_ERROR,
  payload: {
    error
  }
});
