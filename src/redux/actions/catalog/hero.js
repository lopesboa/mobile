// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../layer/data/_types';
import translations from '../../../translations';
import type {SupportedLanguage} from '../../../translations/_types';
import type {StoreAction, StoreErrorAction} from '../../_types';

export const FETCH_REQUEST = '@@hero/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@hero/FETCH_SUCCESS';
export const FETCH_ERROR = '@@hero/FETCH_ERROR';

export type FetchRequestAction = {|
  type: '@@hero/FETCH_REQUEST',
  payload: {
    language: SupportedLanguage
  }
|};

export type FetchSuccessAction = {|
  type: '@@hero/FETCH_SUCCESS',
  payload: {
    language: SupportedLanguage,
    item?: DisciplineCard | ChapterCard
  }
|};

export type FetchErrorAction = StoreErrorAction<{|
  type: '@@hero/FETCH_ERROR'
|}>;

export type Action = FetchRequestAction | FetchSuccessAction | FetchErrorAction;

export const fetchRequest = (language: SupportedLanguage): FetchRequestAction => ({
  type: FETCH_REQUEST,
  payload: {
    language
  }
});

export const fetchSuccess = (
  item?: DisciplineCard | ChapterCard,
  language: SupportedLanguage
): FetchSuccessAction => ({
  type: FETCH_SUCCESS,
  payload: {
    language,
    item
  }
});

export const fetchError = (error: Error): FetchErrorAction => ({
  type: FETCH_ERROR,
  payload: error,
  error: true
});

export const fetchHero = (): StoreAction<Action> => async (dispatch, getState, options) => {
  const language = translations.getLanguage();
  await dispatch(fetchRequest(language));

  const {services} = options;

  try {
    const item = await services.Hero.get();

    return dispatch(fetchSuccess(item, language));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};
