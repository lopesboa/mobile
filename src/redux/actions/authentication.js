// @flow strict

import decode from 'jwt-decode';
import type {StoreAction} from '../_types';

export const SIGN_IN_REQUEST = `@@authentication/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `@@authentication/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `@@authentication/SIGN_IN_ERROR`;
export const SIGN_OUT = `@@authentication/SIGN_OUT`;

export type Action =
  | {|
      type: '@@authentication/SIGN_IN_REQUEST',
      payload: string
    |}
  | {|
      type: '@@authentication/SIGN_IN_SUCCESS',
      payload: string
    |}
  | {|
      type: '@@authentication/SIGN_IN_ERROR',
      payload: Error,
      error: true
    |}
  | {|
      type: '@@authentication/SIGN_OUT'
    |};

export const signIn = (token: string): StoreAction<Action> => async dispatch => {
  await dispatch({
    type: SIGN_IN_REQUEST,
    payload: token
  });
  try {
    const data: mixed = decode(token);

    if (data && (data.iss !== 'coorpacademy-jwt' || !data.host))
      throw new Error("JWT isn't from Coorpacademy");

    return dispatch({
      type: SIGN_IN_SUCCESS,
      payload: token
    });
  } catch (err) {
    return dispatch({
      type: SIGN_IN_ERROR,
      payload: err,
      error: true
    });
  }
};

export const signOut = (): Action => ({
  type: SIGN_OUT
});
