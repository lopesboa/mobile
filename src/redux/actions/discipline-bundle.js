// @flow strict

/* eslint-disable import/prefer-default-export */

import type {SupportedLanguage} from '../../translations/_types';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import {CARD_TYPE} from '../../layer/data/_const';
import type {StoreAction} from '../_types';

export const FETCH_REQUEST = '@@discipline-bundle/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@discipline-bundle/FETCH_SUCCESS';
export const FETCH_ERROR = '@@discipline-bundle/FETCH_ERROR';

export type Action =
  | {|
      type: '@@discipline-bundle/FETCH_REQUEST',
      payload: {|
        ref: string,
        languages: Array<SupportedLanguage>
      |}
    |}
  | {|
      type: '@@discipline-bundle/FETCH_SUCCESS',
      payload: {|
        disciplines: {[key: string]: Array<SupportedLanguage>},
        chapters: {[key: string]: Array<SupportedLanguage>}
      |}
    |}
  | {|
      type: '@@discipline-bundle/FETCH_ERROR',
      payload: {|
        ref?: string,
        languages?: Array<SupportedLanguage>
      |}
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

export const fetchError = (ref?: string, languages?: Array<SupportedLanguage>): Action => ({
  type: FETCH_ERROR,
  payload: {
    ref,
    languages
  }
});

export const fetchBundles = (
  cards: Array<DisciplineCard | ChapterCard>,
  languages: Array<SupportedLanguage>,
  token: string,
  host: string
): StoreAction<Action> => {
  return async dispatch => {
    await Promise.all(
      cards
        .filter(card => card.type === CARD_TYPE.COURSE)
        .map(card => dispatch(fetchRequest(card.universalRef, languages)))
    );
    return;
  };
};
