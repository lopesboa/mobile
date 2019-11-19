// @flow strict

import type {Options, StoreErrorAction, StoreAction} from '../../_types';
import type {SupportedLanguage} from '../../../translations/_types';

export const SET_REQUEST = '@@language/SET_REQUEST';
export const SET_SUCCESS = '@@language/SET_SUCCESS';
export const SET_ERROR = '@@language/SET_ERROR';

export type Action =
  | {|
      type: '@@language/SET_REQUEST'
    |}
  | {|
      type: '@@language/SET_SUCCESS',
      payload: {|
        lang: SupportedLanguage
      |}
    |}
  | StoreErrorAction<{|
      type: '@@language/SET_ERROR'
    |}>;

export const setRequest = (): Action => ({
  type: SET_REQUEST
});

export const setSuccess = (lang: SupportedLanguage): Action => ({
  type: SET_SUCCESS,
  payload: {
    lang
  }
});

export const setError = (e: Error): Action => ({
  type: SET_ERROR,
  payload: e,
  error: true
});

export const setLanguage = (language: SupportedLanguage | null): StoreAction<Action> => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options
) => {
  try {
    await dispatch(setRequest());

    const lang = language || services.Language.getFromInterface();

    services.Language.set(lang);

    return dispatch(setSuccess(lang));
  } catch (e) {
    return dispatch(setError(e));
  }
};
