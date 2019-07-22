// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../../layer/data/_types';
import type {SupportedLanguage} from '../../../../translations/_types';
import type {StoreAction} from '../../../_types';
import {CONTENT_TYPE} from '../../../../const';

export const REFRESH = '@@cards/REFRESH';

export type Action = {|
  type: '@@cards/REFRESH',
  payload: {
    language: SupportedLanguage,
    item: DisciplineCard | ChapterCard
  }
|};

export const refreshCard = (
  language: SupportedLanguage,
  item: DisciplineCard | ChapterCard
): Action => ({
  type: REFRESH,
  payload: {
    language,
    item
  }
});

export const updateCard = (
  language: SupportedLanguage,
  card: DisciplineCard | ChapterCard
): StoreAction<Action> => {
  return async (dispatch, getState, options) => {
    const {services} = options;
    const refreshedCard = await services.Cards.refreshCard(card);
    return dispatch(refreshCard(language, refreshedCard));
  };
};

export const getAndRefreshCard = (
  progressionId: string,
  language: SupportedLanguage
): StoreAction<Action> => async (dispatch, getState, options) => {
  const {services} = options;

  const progression = await services.Progressions.findById(progressionId);
  if (
    progression &&
    (progression.content.type === CONTENT_TYPE.CHAPTER ||
      progression.content.type === CONTENT_TYPE.LEVEL)
  ) {
    const card = await services.Cards.getCardFromLocalStorage(progression.content.ref, language);
    if (card) {
      return dispatch(updateCard(language, card));
    }
  }
};
