// @flow strict

import type {Options, StoreErrorAction, StoreAction} from '../../_types';
import type {SupportedLanguage} from '../../../translations/_types';

import {setLanguage} from './set';
import type {Action as SetAction} from './set';

export const FETCH_REQUEST = '@@language/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@language/FETCH_SUCCESS';
export const FETCH_ERROR = '@@language/FETCH_ERROR';

export type Action =
  | {|
      type: '@@language/FETCH_REQUEST'
    |}
  | {|
      type: '@@language/FETCH_SUCCESS',
      payload: {|
        lang: SupportedLanguage
      |}
    |}
  | StoreErrorAction<{|
      type: '@@language/FETCH_ERROR'
    |}>;

export const fetchRequest = (): Action => ({
  type: FETCH_REQUEST
});

export const fetchSuccess = (lang: SupportedLanguage): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    lang
  }
});

export const fetchError = (e: Error): Action => ({
  type: FETCH_ERROR,
  payload: e,
  error: true
});

export const fetchLanguage: StoreAction<Action | SetAction> = async (
  dispatch: Dispatch,
  getState: GetState,
  options: Options
) => {
  const {services} = options;

  try {
    await dispatch(fetchRequest());
    const lang = await services.Language.fetch();

    // $FlowFixMe callable signature
    await setLanguage(lang)(dispatch, getState, options);

    return dispatch(fetchSuccess(lang));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};
