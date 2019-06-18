// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../layer/data/_types';
import type {SupportedLanguage} from '../../../translations/_types';
import type {StoreAction, ErrorAction} from '../../_types';
import {ENGINE, CONTENT_TYPE, ERROR_TYPE} from '../../../const';
import {getToken, getBrand, getSection} from '../../utils/state-extract';
import {pickNextLevel} from '../../../utils/content';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../../../layer/data/_const';
import {createLevelProgression, createChapterProgression, selectProgression} from '../progression';
import type {Action as ModalAction} from '../ui/modal';
import {showModal} from '../ui/modal';

import type {StoreState} from '../../store';
import type {Services} from '../../../services';
import {NoContentFoundError} from '../../../models/error';

export const FETCH_REQUEST = '@@cards/FETCH_REQUEST';
export const FETCH_SUCCESS = '@@cards/FETCH_SUCCESS';
export const FETCH_ERROR = '@@cards/FETCH_ERROR';
export const SELECT_CARD = '@@cards/SELECT_CARD';
export const SELECT_CARD_FAILURE = '@@cards/SELECT_CARD_FAILURE';
export const REFRESH_CARD = '@@cards/REFRESH_CARD';

export type Action =
  | {|
      type: '@@cards/FETCH_REQUEST',
      payload: {
        sectionKey: string,
        offset: number,
        limit: number,
        language: SupportedLanguage
      }
    |}
  | {|
      type: '@@cards/FETCH_SUCCESS',
      payload: {
        sectionKey: string,
        offset: number,
        limit: number,
        total: number,
        items: Array<DisciplineCard | ChapterCard>,
        language: SupportedLanguage
      }
    |}
  | ErrorAction<{|
      type: '@@cards/FETCH_ERROR'
    |}>
  | {|
      type: '@@cards/SELECT_CARD',
      payload: {
        item: DisciplineCard | ChapterCard
      }
    |}
  | ErrorAction<{|
      type: '@@cards/SELECT_CARD_FAILURE'
    |}>
  | {|
      type: '@@cards/REFRESH_CARD',
      payload: {
        item: DisciplineCard | ChapterCard,
        language: SupportedLanguage
      }
    |};

export const fetchRequest = (
  sectionKey: string,
  offset: number,
  limit: number,
  language: SupportedLanguage
): Action => ({
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
): Action => ({
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

export const fetchError = (error: Error): Action => ({
  type: FETCH_ERROR,
  payload: error,
  error: true
});

export const refreshCard = (
  language: SupportedLanguage,
  card: DisciplineCard | ChapterCard
): Action => ({
  type: REFRESH_CARD,
  payload: {
    language,
    item: card
  }
});

export const fetchCards = (
  sectionKey: string,
  offset: number,
  limit: number,
  language: SupportedLanguage
): StoreAction<Action | ModalAction<StoreAction<Action>>> => async (
  dispatch,
  getState,
  options
) => {
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

    const {cards, total} = await services.Cards.find(
      token,
      brand.host,
      section,
      offset,
      limit,
      language
    );

    return dispatch(fetchSuccess(sectionKey, offset, limit, total, cards, language));
  } catch (e) {
    return dispatch(fetchError(e));
  }
};

export const selectCardFailure = (item?: DisciplineCard | ChapterCard, error: Error): Action => ({
  type: SELECT_CARD_FAILURE,
  payload: error,
  error: true
});

export const attemptToRetrieveContent = async (
  card: DisciplineCard | ChapterCard,
  state: StoreState,
  services: Services,
  nextModuleId?: string
) => {
  const token = getToken(state);
  const brand = getBrand(state);

  if (card.type === CARD_TYPE.COURSE && !nextModuleId) {
    throw new NoContentFoundError(
      `No Content Found for card with universalRef ${card.universalRef} `
    );
  }

  if (!token || !brand) {
    throw new Error('Chapter progression not created - no token or brand provided');
  }

  const bundleType =
    card.type === CARD_TYPE.COURSE
      ? RESTRICTED_RESOURCE_TYPE.DISCIPLINE
      : RESTRICTED_RESOURCE_TYPE.CHAPTER;

  const contentType =
    card.type === CARD_TYPE.COURSE
      ? RESTRICTED_RESOURCE_TYPE.LEVEL
      : RESTRICTED_RESOURCE_TYPE.CHAPTER;

  const contentId =
    card.type === CARD_TYPE.COURSE && nextModuleId ? nextModuleId : card.universalRef;

  const bundle = await services.Bundle.findById(
    bundleType,
    card.universalRef,
    card.lang,
    token,
    brand.host
  );

  await services.Bundle.store(bundle, card.lang);
  const content = await services.Content.find(contentType, contentId);

  if (!content) {
    throw new NoContentFoundError(
      `No Content Found for card with universalRef ${card.universalRef} `
    );
  }

  return content;
};

export const selectCard = (
  item: DisciplineCard | ChapterCard
): StoreAction<Action | ModalAction<StoreAction<Action>>> => {
  return async (dispatch, getState, options) => {
    // fetch bundle
    const {services} = options;
    const state = getState();
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

          let chapter = await services.Content.find(
            // $FlowFixMe union type
            RESTRICTED_RESOURCE_TYPE.CHAPTER,
            item.universalRef
          );

          if (!chapter) {
            chapter = await attemptToRetrieveContent(item, state, services);
          }

          // $FlowFixMe union type
          const {payload: progression} = await dispatch(createChapterProgression(chapter));
          // $FlowFixMe union type
          return dispatch(selectProgression(progression._id));
        } catch (e) {
          if (e instanceof NoContentFoundError) {
            return dispatch(
              showModal({
                errorType: ERROR_TYPE.NO_CONTENT_FOUND,
                lastAction: () => selectCard(item)
              })
            );
          } else {
            return dispatch(selectCardFailure(item, new Error('Chapter progression not created')));
          }
        }
      }
      case CARD_TYPE.COURSE: {
        const nextModule = pickNextLevel(item);
        if (!nextModule) {
          return dispatch(selectCardFailure(item, new Error('Course has no level')));
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
          let level = await services.Content.find(
            RESTRICTED_RESOURCE_TYPE.LEVEL,
            nextModule.universalRef
          );

          if (!level) {
            level = await attemptToRetrieveContent(item, state, services, nextModule.universalRef);
          }
          // $FlowFixMe union type
          const {payload: progression} = await dispatch(createLevelProgression(level));
          // $FlowFixMe union type
          return dispatch(selectProgression(progression._id));
        } catch (e) {
          if (e instanceof NoContentFoundError) {
            return dispatch(
              showModal({
                errorType: ERROR_TYPE.NO_CONTENT_FOUND,
                lastAction: () => selectCard(item)
              })
            );
          } else {
            return dispatch(selectCardFailure(item, new Error('Level progression not created')));
          }
        }
      }

      default:
        throw new Error('card type not handled');
    }
  };
};

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
