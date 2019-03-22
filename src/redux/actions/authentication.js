// @flow strict

import decode from 'jwt-decode';
import {Alert, AsyncStorage} from 'react-native';
import translations from '../../translations';
import type {StoreAction} from '../_types';
import localToken from '../../utils/local-token';

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

    localToken.set(token);
    return dispatch({
      type: SIGN_IN_SUCCESS,
      payload: token
    });
  } catch (err) {
    localToken.set(null);
    return dispatch({
      type: SIGN_IN_ERROR,
      payload: err,
      error: true
    });
  }
};

export const signOut = (): StoreAction<Action> => async dispatch => {
  const isAccepted = await new Promise(resolve =>
    Alert.alert(translations.logOut, null, [
      {
        text: translations.cancel,
        onPress: () => resolve(false)
      },
      {
        text: translations.ok,
        onPress: () => resolve(true)
      }
    ])
  );
  if (!isAccepted) return;
  await AsyncStorage.clear();
  return dispatch({
    type: SIGN_OUT
  });
};
