// @flow strict

import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import type {SupportedLanguage} from '../../translations/_types';

/* eslint-disable import/prefer-default-export */

export const FETCH_REQUEST = `@@cards/FETCH_REQUEST`;
export const FETCH_SUCCESS = `@@cards/FETCH_SUCCESS`;
export const FETCH_ERROR = `@@cards/FETCH_ERROR`;
export const SELECT_CARD = '@@cards/SELECT_CARD';
export const SELECT_CARD_FAILURE = '@@cards/SELECT_CARD_FAILURE';

export type FetchRequestPayload = {|
  language: SupportedLanguage
|};

export type FetchSuccessPayload = {|
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
|};

export type FetchErrorPayload = {|
  error: string
|};

export type SelectCardPayload = {|
  item: DisciplineCard | ChapterCard
|};

export type SelectCardFailurePayload = {|
  item?: DisciplineCard | ChapterCard,
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
    |}
  | {|
      type: typeof SELECT_CARD,
      payload: SelectCardPayload
    |}
  | {|
      type: typeof SELECT_CARD_FAILURE,
      payload: SelectCardFailurePayload
    |};

export const fetchRequest = (language: SupportedLanguage): Action => ({
  type: FETCH_REQUEST,
  payload: {
    language
  }
});

export const fetchSuccess = (
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    items,
    language
  }
});

export const fetchError = (error: string): Action => ({
  type: FETCH_ERROR,
  payload: {
    error
  }
});

export const selectCard = (item: DisciplineCard | ChapterCard): Action => ({
  type: SELECT_CARD,
  payload: {
    item
  }
});

export const selectCardFailure = (item?: DisciplineCard | ChapterCard, error: string): Action => ({
  type: SELECT_CARD_FAILURE,
  payload: {
    item,
    error
  }
});
