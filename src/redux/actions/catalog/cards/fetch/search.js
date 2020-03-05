// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../../../layer/data/_types';
import translations from '../../../../../translations';
import type {SupportedLanguage} from '../../../../../translations/_types';
import type {StoreAction, StoreErrorAction} from '../../../../_types';
import {getToken, getBrand} from '../../../../utils/state-extract';
import type {Action as ErrorAction} from '../../../ui/errors';
import {fetch as toggleFetch} from '../../../ui/search';
import type {Action as SearchAction} from '../../../ui/search';

export const FETCH_REQUEST = '@@cards/FETCH_SEARCH_REQUEST';
export const FETCH_SUCCESS = '@@cards/FETCH_SEARCH_SUCCESS';
export const FETCH_ERROR = '@@cards/FETCH_SEARCH_ERROR';

export const DEFAULT_LIMIT = 16;

export type FetchRequestAction = {|
  type: '@@cards/FETCH_SEARCH_REQUEST',
  payload: {
    search: string,
    offset: number,
    limit: number,
    language: SupportedLanguage,
    forceRefresh: boolean
  }
|};

export type FetchSuccessAction = {|
  type: '@@cards/FETCH_SEARCH_SUCCESS',
  payload: {
    search: string,
    offset: number,
    limit: number,
    total: number,
    items: Array<DisciplineCard | ChapterCard>,
    language: SupportedLanguage,
    forceRefresh: boolean
  }
|};

export type FetchErrorAction = StoreErrorAction<{|
  type: '@@cards/FETCH_SEARCH_ERROR'
|}>;

export type Action = FetchRequestAction | FetchSuccessAction | FetchErrorAction;

export const fetchRequest = (
  search: string,
  offset: number,
  limit: number,
  language: SupportedLanguage,
  forceRefresh?: boolean = false
): FetchRequestAction => ({
  type: FETCH_REQUEST,
  payload: {
    search,
    offset,
    limit,
    language,
    forceRefresh
  }
});

export const fetchSuccess = (
  search: string,
  offset: number,
  limit: number,
  total: number,
  items: Array<DisciplineCard | ChapterCard>,
  language: SupportedLanguage,
  forceRefresh?: boolean = false
): FetchSuccessAction => ({
  type: FETCH_SUCCESS,
  payload: {
    search,
    offset,
    limit,
    total,
    items,
    language,
    forceRefresh
  }
});

export const fetchError = (error: Error): FetchErrorAction => ({
  type: FETCH_ERROR,
  payload: error,
  error: true
});

export const fetchCards = (
  search: string,
  offset: number,
  limit: number,
  forceRefresh?: boolean = false
): StoreAction<Action | ErrorAction<StoreAction<Action>> | SearchAction> => async (
  dispatch,
  getState,
  options
) => {
  const language = translations.getLanguage();
  await dispatch(fetchRequest(search, offset, limit, language, forceRefresh));
  await dispatch(toggleFetch(true));

  const state = getState();
  const token = getToken(state);
  const brand = getBrand(state);

  const {services} = options;

  try {
    if (token === null) throw new TypeError('Token not defined');
    if (brand === null) throw new TypeError('Brand not defined');

    const {cards, total} = await services.Cards.findBySearch(
      token,
      brand.host,
      search,
      offset,
      limit
    );

    await dispatch(toggleFetch(false));
    return dispatch(fetchSuccess(search, offset, limit, total, cards, language, forceRefresh));
  } catch (e) {
    await dispatch(toggleFetch(false));
    return dispatch(fetchError(e));
  }
};
