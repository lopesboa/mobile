// @flow

import decode from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';

import fetch from '../../modules/fetch';
import type {StoreAction, StoreErrorAction} from '../_types';
import {ANALYTICS_EVENT_TYPE} from '../../const';
import type {JWT, AuthenticationType} from '../../types';
import {set as setToken} from '../../utils/local-token';
import {getBrand, getToken} from '../utils/state-extract';
import {fetchBrand} from './brands';
import {fetchUser} from './user';
import type {Action as BrandsAction} from './brands';
import {fetchLanguage} from './language/fetch';
import type {Action as FetchLanguageAction} from './language/fetch';
import {setLanguage} from './language/set';
import type {Action as SetLanguageAction} from './language/set';

export const SIGN_IN_REQUEST = `@@authentication/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `@@authentication/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `@@authentication/SIGN_IN_ERROR`;
export const SIGN_OUT = `@@authentication/SIGN_OUT`;

export type Action =
  | {|
      type: '@@authentication/SIGN_IN_REQUEST',
      payload?: string
    |}
  | {|
      type: '@@authentication/SIGN_IN_SUCCESS',
      payload: string
    |}
  | StoreErrorAction<{|
      type: '@@authentication/SIGN_IN_ERROR'
    |}>
  | {|
      type: '@@authentication/SIGN_OUT'
    |};

export const signInRequest = (token?: string): Action => ({
  type: SIGN_IN_REQUEST,
  payload: token
});

export const signInSuccess = (token: string): Action => ({
  type: SIGN_IN_SUCCESS,
  payload: token
});

export const signInError = (e: Error): Action => ({
  type: SIGN_IN_ERROR,
  payload: e,
  error: true
});

export const getAnonymousToken = async (): Promise<string> => {
  const response = await fetch('https://up.coorpacademy.com/api/v1/anonymous/mobile', {
    method: 'POST'
  });
  const token = await response.text();

  return token;
};

export const signIn = (
  authenticationType: AuthenticationType,
  _token?: string
): StoreAction<Action | BrandsAction | FetchLanguageAction | SetLanguageAction> => async (
  dispatch,
  getState,
  options
) => {
  await dispatch(signInRequest(_token));
  try {
    const token = _token || (await getAnonymousToken());
    await setToken(token);

    const jwt: JWT = decode(token);

    if (jwt && (jwt.iss !== 'coorpacademy-jwt' || !jwt.host)) {
      throw new Error("JWT isn't from Coorpacademy");
    }

    // $FlowFixMe wrong StoreAction type
    const action = await fetchBrand(token)(dispatch, getState, options);

    if (action.error) {
      throw new Error(action.payload.error);
    }

    const brand = getBrand(getState());

    if (!brand) {
      throw new Error('Incorrect brand');
    }

    // $FlowFixMe wrong StoreAction type
    await fetchLanguage(dispatch, getState, options);
    // $FlowFixMe wrong StoreAction type
    await fetchUser(token)(dispatch, getState, options);

    const {services} = options;

    services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.SIGN_IN, {
      userId: jwt.user,
      brand: brand.name,
      authenticationType
    });

    return dispatch(signInSuccess(token));
  } catch (e) {
    setToken(null);
    // $FlowFixMe wrong StoreAction type
    await setLanguage(null)(dispatch, getState, options);
    return dispatch(signInError(e));
  }
};

export const signOut = (): StoreAction<Action | SetLanguageAction> => async (
  dispatch,
  getState,
  options
) => {
  await AsyncStorage.clear();

  // $FlowFixMe wrong StoreAction type
  await setLanguage(null)(dispatch, getState, options);

  const brand = getBrand(getState());
  const token = getToken(getState());
  const jwt: JWT | void = token ? decode(token) : undefined;

  const {services} = options;
  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.SIGN_OUT, {
    ...(brand ? {brand: brand.name} : {}),
    userId: jwt && jwt.user
  });

  return dispatch({
    type: SIGN_OUT
  });
};
