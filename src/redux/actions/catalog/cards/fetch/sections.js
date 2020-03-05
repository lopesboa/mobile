// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../../../layer/data/_types';
import translations from '../../../../../translations';
import type {SupportedLanguage} from '../../../../../translations/_types';
import type {StoreAction, StoreErrorAction} from '../../../../_types';
import {getToken, getBrand, getSection} from '../../../../utils/state-extract';
import type {Action as ErrorAction} from '../../../ui/errors';

export const FETCH_REQUEST = '@@cards/FETCH_SECTIONS_REQUEST';
export const FETCH_SUCCESS = '@@cards/FETCH_SECTIONS_SUCCESS';
export const FETCH_ERROR = '@@cards/FETCH_SECTIONS_ERROR';

export const DEFAULT_LIMIT = 5;

export type FetchRequestAction = {|
  type: '@@cards/FETCH_SECTIONS_REQUEST',
  payload: {
    sectionKey: string,
    offset: number,
    limit: number,
    language: SupportedLanguage
  }
|};

export type FetchSuccessAction = {|
  type: '@@cards/FETCH_SECTIONS_SUCCESS',
  payload: {
    sectionKey: string,
    offset: number,
    limit: number,
    total: number,
    items: Array<DisciplineCard | ChapterCard>,
    language: SupportedLanguage
  }
|};

export type FetchErrorAction = StoreErrorAction<{|
  type: '@@cards/FETCH_SECTIONS_ERROR'
|}>;

export type Action = FetchRequestAction | FetchSuccessAction | FetchErrorAction;

export const fetchRequest = (
  sectionKey: string,
  offset: number,
  limit: number,
  language: SupportedLanguage
): FetchRequestAction => ({
  type: FETCH_REQUEST,
  payload: {
    sectionKey,
    offset,
    limit,
    language
  }
});

export const fetchSuccess = (
  sectionKey: string,
  offset: number,
  limit: number,
  total: number,
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage
): FetchSuccessAction => ({
  type: FETCH_SUCCESS,
  payload: {
    sectionKey,
    offset,
    limit,
    total,
    items,
    language
  }
});

export const fetchError = (error: Error): FetchErrorAction => ({
  type: FETCH_ERROR,
  payload: error,
  error: true
});

export const fetchCards = (
  sectionKey: string,
  offset: number,
  limit: number
): StoreAction<Action | ErrorAction<StoreAction<Action>>> => async (
  dispatch,
  getState,
  options
) => {
  const language = translations.getLanguage();
  await dispatch(fetchRequest(sectionKey, offset, limit, language));

  const state = getState();
  const token = getToken(state);
  const brand = getBrand(state);
  const section = getSection(state, sectionKey);

  const {services} = options;

  try {
    if (token === null) throw new TypeError('Token not defined');
    if (brand === null) throw new TypeError('Brand not defined');
    if (!section) throw new Error('Section not found');

    const {cards, total} = await services.Cards.findBySection(
      token,
      brand.host,
      section,
      offset,
      limit
    );

    return dispatch(fetchSuccess(sectionKey, offset, limit, total, cards, language));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};
