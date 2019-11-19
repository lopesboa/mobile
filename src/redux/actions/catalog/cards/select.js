// @flow strict

import type {DisciplineCard, ChapterCard} from '../../../../layer/data/_types';
import type {StoreAction, StoreErrorAction} from '../../../_types';
import {ERROR_TYPE} from '../../../../const';
import {getToken, getBrand} from '../../../utils/state-extract';
import {pickNextCardLevel} from '../../../../utils/content';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../../../../layer/data/_const';
import {createNextProgression} from '../../progressions/create-next-progression';
import type {Action as ErrorAction} from '../../ui/errors';
import {showError} from '../../ui/errors';
import type {StoreState} from '../../../store';
import type {Services} from '../../../../services';
import {NoContentFoundError} from '../../../../models/error';

export const SELECT_REQUEST = '@@cards/SELECT_REQUEST';
export const SELECT_SUCCESS = '@@cards/SELECT_SUCCESS';
export const SELECT_ERROR = '@@cards/SELECT_ERROR';

export type SelectRequestAction = {|
  type: '@@cards/SELECT_REQUEST',
  payload: DisciplineCard | ChapterCard
|};

export type SelectSuccessAction = {|
  type: '@@cards/SELECT_SUCCESS',
  payload: DisciplineCard | ChapterCard
|};

export type SelectErrorAction = StoreErrorAction<{|
  type: '@@cards/SELECT_ERROR'
|}>;

export type Action = SelectRequestAction | SelectSuccessAction | SelectErrorAction;

export const selectRequest = (item: DisciplineCard | ChapterCard): SelectRequestAction => ({
  type: SELECT_REQUEST,
  payload: item
});

export const selectSuccess = (item: DisciplineCard | ChapterCard): SelectSuccessAction => ({
  type: SELECT_SUCCESS,
  payload: item
});

export const selectError = (error: Error): SelectErrorAction => ({
  type: SELECT_ERROR,
  payload: error,
  error: true
});

// @flow move this function elsewhere or create a real action
const attemptToRetrieveContent = async (
  card: DisciplineCard | ChapterCard,
  state: StoreState,
  services: Services,
  levelRef?: string
) => {
  const token = getToken(state);
  const brand = getBrand(state);

  if (card.type === CARD_TYPE.COURSE && !levelRef) {
    throw new NoContentFoundError(
      `No Content Found for card with universalRef ${card.universalRef}`
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

  const contentId = card.type === CARD_TYPE.COURSE && levelRef ? levelRef : card.universalRef;

  const bundle = await services.Bundle.findById(bundleType, card.universalRef, token, brand.host);

  await services.Bundle.store(bundle);
  const content = await services.Content.find(contentType, contentId);

  if (!content) {
    throw new NoContentFoundError(
      `No Content Found for card with universalRef ${card.universalRef}`
    );
  }

  return content;
};

export const selectCard = (
  item: DisciplineCard | ChapterCard
): StoreAction<Action | ErrorAction<StoreAction<Action>>> => async (
  dispatch,
  getState,
  options
) => {
  const {services} = options;
  const state = getState();
  dispatch(selectRequest(item));

  try {
    if (![CARD_TYPE.CHAPTER, CARD_TYPE.COURSE].includes(item.type)) {
      throw new Error('Card type not handled');
    }

    if (item.type === CARD_TYPE.CHAPTER) {
      let chapter = await services.Content.find(
        // $FlowFixMe union type
        RESTRICTED_RESOURCE_TYPE.CHAPTER,
        item.universalRef
      );

      if (!chapter) {
        chapter = await attemptToRetrieveContent(item, state, services);
      }

      await dispatch(
        // $FlowFixMe dispatched action
        createNextProgression(RESTRICTED_RESOURCE_TYPE.CHAPTER, item.universalRef)
      );
    }

    if (item.type === CARD_TYPE.COURSE) {
      const nextLevel = pickNextCardLevel(item);

      if (!nextLevel) {
        throw new Error('Course has no level');
      }

      let level = await services.Content.find(
        RESTRICTED_RESOURCE_TYPE.LEVEL,
        nextLevel.universalRef
      );

      if (!level) {
        level = await attemptToRetrieveContent(item, state, services, nextLevel.universalRef);
      }

      await dispatch(
        // $FlowFixMe dispatched action
        createNextProgression(RESTRICTED_RESOURCE_TYPE.LEVEL, level.universalRef)
      );
    }

    return dispatch(selectSuccess(item));
  } catch (e) {
    if (e instanceof NoContentFoundError) {
      dispatch(
        showError({
          type: ERROR_TYPE.NO_CONTENT_FOUND,
          lastAction: () => selectCard(item)
        })
      );
    }

    return dispatch(selectError(e));
  }
};
