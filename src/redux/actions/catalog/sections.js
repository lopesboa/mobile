// @flow strict

import type {Section} from '../../../types';
import translations from '../../../translations';
import type {SupportedLanguage} from '../../../translations/_types';
import type {StoreAction, StoreErrorAction} from '../../_types';
import {getToken, getSection} from '../../utils/state-extract';
import {ERROR_TYPE} from '../../../const';
import {showError} from '../ui/errors';
import type {Action as ErrorAction} from '../ui/errors';
import {fetchCards, DEFAULT_LIMIT} from './cards/fetch/sections';

export const FETCH_REQUEST = '@@sections/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@sections/FETCH_SUCCESS';
export const FETCH_ERROR = '@@sections/FETCH_ERROR';

export type Action =
  | {|
      type: '@@sections/FETCH_REQUEST',
      payload: {
        offset: number,
        limit: number,
        language: SupportedLanguage
      }
    |}
  | {|
      type: '@@sections/FETCH_SUCCESS',
      payload: {
        offset: number,
        limit: number,
        total: number,
        items: Array<Section>,
        language: SupportedLanguage
      }
    |}
  | StoreErrorAction<{|
      type: '@@sections/FETCH_ERROR'
    |}>;

export const fetchRequest = (
  offset: number,
  limit: number,
  language: SupportedLanguage
): Action => ({
  type: FETCH_REQUEST,
  payload: {
    offset,
    limit,
    language
  }
});

export const fetchSuccess = (
  offset: number,
  limit: number,
  total: number,
  items: Array<Section>,
  language: SupportedLanguage
): Action => ({
  type: FETCH_SUCCESS,
  payload: {
    offset,
    limit,
    total,
    items,
    language
  }
});

export const fetchError = (error: Error): Action => ({
  type: FETCH_ERROR,
  payload: error,
  error: true
});

export const fetchSections = (
  offset: number,
  limit: number,
  forceRefresh?: boolean = false
): StoreAction<Action | ErrorAction<StoreAction<Action>>> => async (
  dispatch,
  getState,
  options
) => {
  const {services} = options;
  const language = translations.getLanguage();

  try {
    await dispatch(fetchRequest(offset, limit, language));
    const token = getToken(getState());

    if (!token) {
      throw new Error('Token not defined');
    }

    const {total, sections} = await services.Sections.find(token, offset, limit);
    const result = await dispatch(fetchSuccess(offset, limit, total, sections, language));

    await Promise.all(
      sections
        // Fetch only new sections
        .filter(({key}: Section) => {
          const section = getSection(getState(), key);
          return forceRefresh || !(section && section.cardsRef);
        })
        .map(section =>
          // $FlowFixMe callable signature
          fetchCards(section.key, 0, DEFAULT_LIMIT, language)(dispatch, getState, options)
        )
    );

    return result;
  } catch (e) {
    dispatch(fetchError(e));
    return dispatch(
      showError({
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        lastAction: () => fetchSections(offset, limit, forceRefresh)
      })
    );
  }
};
