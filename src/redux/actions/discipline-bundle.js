// @flow strict

/* eslint-disable import/prefer-default-export */

import type {SupportedLanguage} from '../../translations/_types';

export const FETCH_REQUEST = `@@discipline-bundle/FETCH_REQUEST`;
export const FETCH_SUCCESS = `@@discipline-bundle/FETCH_SUCCESS`;
export const FETCH_ERROR = `@@discipline-bundle/FETCH_ERROR`;

type FetchPayload = {|
  ref: string,
  languages: Array<SupportedLanguage>
|};

type FetchSuccessPayload = {|
  disciplines: {[key: string]: Array<SupportedLanguage>},
  chapters: {[key: string]: Array<SupportedLanguage>}
|};

type FetchErrorPayload = FetchPayload;

export type Action = {|
  type:
    | '@@discipline-bundle/FETCH_REQUEST'
    | '@@discipline-bundle/FETCH_SUCCESS'
    | '@@discipline-bundle/FETCH_ERROR',
  payload: FetchPayload | FetchSuccessPayload | FetchErrorPayload
|};

export const fetchRequest = (ref: string, languages: Array<SupportedLanguage>): Action => ({
  type: FETCH_REQUEST,
  payload: {
    ref,
    languages
  }
});

export const fetchSuccess = (
  disciplines: {[key: string]: Array<SupportedLanguage>},
  chapters: {[key: string]: Array<SupportedLanguage>}
): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    disciplines,
    chapters
  }
});

export const fetchError = (ref: string, languages: Array<SupportedLanguage>): Action => ({
  type: FETCH_ERROR,
  payload: {
    ref,
    languages
  }
});
