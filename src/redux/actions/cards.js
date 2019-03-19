// @flow strict

import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import type {SupportedLanguage} from '../../translations/_types';
import type {StoreAction} from '../_types';
import {ENGINE} from '../../const';
import {getToken, getBrand} from '../utils/state-extract';
import {pickNextLevel} from '../../utils/content';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../../layer/data/_const';
import {createLevelProgression, createChapterProgression, selectProgression} from './progression';
import type {Action as BundleAction} from './discipline-bundle';
import {fetchBundles} from './discipline-bundle';

/* eslint-disable import/prefer-default-export */

export const FETCH_REQUEST = '@@cards/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@cards/FETCH_SUCCESS';
export const FETCH_ERROR = '@@cards/FETCH_ERROR';
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
      type: '@@cards/FETCH_REQUEST',
      payload: FetchRequestPayload
    |}
  | {|
      type: '@@cards/FETCH_SUCCESS',
      payload: FetchSuccessPayload
    |}
  | {|
      type: '@@cards/FETCH_ERROR',
      payload: FetchErrorPayload
    |}
  | {|
      type: '@@cards/SELECT_CARD',
      payload: SelectCardPayload
    |}
  | {|
      type: '@@cards/SELECT_CARD_FAILURE',
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
export const fetchCards = (language: SupportedLanguage): StoreAction<Action | BundleAction> => {
  return async (dispatch, getState, options) => {
    await dispatch(fetchRequest(language));

    const state = getState();
    const token = getToken(state);
    const brand = getBrand(state);

    if (token === null) return dispatch(fetchError('Token not defined'));
    if (brand === null) return dispatch(fetchError('Brand not defined'));

    const {services} = options;
    try {
      const cards = await services.Cards.find(token, brand.host, language);
      // $FlowFixMe
      await dispatch(fetchBundles(cards, [language]));

      return dispatch(fetchSuccess(cards, language));
    } catch (err) {
      return dispatch(fetchError(err.toString()));
    }
  };
};

export const selectCardFailure = (item?: DisciplineCard | ChapterCard, error: string): Action => ({
  type: SELECT_CARD_FAILURE,
  payload: {
    item,
    error
  }
});

export const selectCard = (item: DisciplineCard | ChapterCard): StoreAction<Action> => {
  return async (dispatch, getState, options) => {
    const {services} = options;
    switch (item.type) {
      case CARD_TYPE.CHAPTER: {
        try {
          // Resume progression
          const lastProgression = await services.Progressions.findLast(
            ENGINE.MICROLEARNING,
            item.universalRef
          );
          if (lastProgression) {
            // $FlowFixMe union type
            return dispatch(selectProgression(lastProgression._id));
          }

          const chapter = await services.Content.find(
            // $FlowFixMe union type
            RESTRICTED_RESOURCE_TYPE.CHAPTER,
            item.universalRef
          );

          // $FlowFixMe union type
          return await dispatch(createChapterProgression(chapter));
        } catch (e) {
          return dispatch(selectCardFailure(item, 'Chapter progression not created'));
        }
      }
      case CARD_TYPE.COURSE: {
        const nextModule = pickNextLevel(item);
        if (!nextModule) {
          return dispatch(selectCardFailure(item, 'Course has no level'));
        }
        try {
          // Resume progression
          const lastProgression = await services.Progressions.findLast(
            ENGINE.LEARNER,
            nextModule.universalRef
          );
          if (lastProgression) {
            // $FlowFixMe union type
            return dispatch(selectProgression(lastProgression._id));
          }

          // $FlowFixMe union type
          const level = await services.Content.find(
            RESTRICTED_RESOURCE_TYPE.LEVEL,
            nextModule.universalRef
          );

          // $FlowFixMe union type
          const {payload: progression} = await dispatch(createLevelProgression(level));
          // $FlowFixMe union type
          return dispatch(selectProgression(progression._id));
        } catch (e) {
          return dispatch(selectCardFailure(item, 'Level progression not created'));
        }
      }
    }
  };
};
