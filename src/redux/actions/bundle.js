// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import type {DisciplineCard, ChapterCard, CardType} from '../../layer/data/_types';
import type {StoreAction} from '../_types';

export const FETCH_REQUEST = '@@bundle/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@bundle/FETCH_SUCCESS';
export const FETCH_ERROR = '@@bundle/FETCH_ERROR';

export type Action =
  | {|
      type: '@@bundle/FETCH_REQUEST',
      payload: {|
        type: CardType,
        ref: string,
        languages: Array<SupportedLanguage>
      |}
    |}
  | {|
      type: '@@bundle/FETCH_SUCCESS',
      payload: {|
        disciplines: {[key: string]: Array<SupportedLanguage>},
        chapters: {[key: string]: Array<SupportedLanguage>}
      |}
    |}
  | {|
      type: '@@bundle/FETCH_ERROR',
      payload: {|
        type?: CardType,
        ref?: string,
        languages?: Array<SupportedLanguage>
      |}
    |};

export const fetchRequest = (
  type: CardType,
  ref: string,
  languages: Array<SupportedLanguage>
): Action => ({
  type: FETCH_REQUEST,
  payload: {
    type,
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

export const fetchError = (
  type?: CardType,
  ref?: string,
  languages?: Array<SupportedLanguage>
): Action => ({
  type: FETCH_ERROR,
  payload: {
    type,
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
      cards.map(card => dispatch(fetchRequest(card.type, card.universalRef, languages)))
    );
    return;
  };
};
