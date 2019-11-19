// @flow strict

import {selectProgression, fetchBestProgression} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI} from '@coorpacademy/player-services';
import type {Progression} from '@coorpacademy/progression-engine';

import type {StoreAction, StoreErrorAction} from '../../_types';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import type {RestrictedResourceType} from '../../../layer/data/_types';
import {RESTRICTED_RESOURCE_TYPE} from '../../../layer/data/_const';
import {getEngineVersions} from '../../utils/state-extract';
import {createChapterProgression} from './create-chapter-progression';
import {createLevelProgression} from './create-level-progression';

export const CREATE_NEXT_REQUEST = '@@progression/CREATE_NEXT_REQUEST';
export const CREATE_NEXT_SUCCESS = '@@progression/CREATE_NEXT_SUCCESS';
export const CREATE_NEXT_FAILURE = '@@progression/CREATE_NEXT_FAILURE';

export type NextProgressionAction =
  | {|
      type: typeof CREATE_NEXT_REQUEST,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}
  | {|
      type: typeof CREATE_NEXT_SUCCESS,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}
  | StoreErrorAction<{|
      type: typeof CREATE_NEXT_FAILURE,
      meta: {|type: RestrictedResourceType, ref: string|}
    |}>;

export const createNextProgression = (
  type: RestrictedResourceType,
  ref: string
): StoreAction<NextProgressionAction> => async (dispatch, getState, options) => {
  const {services} = options;

  await dispatch({
    type: CREATE_NEXT_REQUEST,
    meta: {type, ref}
  });

  try {
    if (![CONTENT_TYPE.CHAPTER, CONTENT_TYPE.LEVEL].includes(type)) {
      throw new Error(`content type ${type} is not handled`);
    }

    const state = getState();
    const engineConfig = getEngineVersions(state);

    let progression = await services.Progressions.findLast(
      type === RESTRICTED_RESOURCE_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER,
      ref
    );

    if (!progression || !progression._id) {
      if (type === RESTRICTED_RESOURCE_TYPE.CHAPTER) {
        // $FlowFixMe union type
        const chapter: ChapterAPI = await services.Content.find(type, ref);

        // $FlowFixMe await on dispatched action
        const action: {payload: Progression} = await dispatch(
          // $FlowFixMe wrong action
          createChapterProgression(chapter, engineConfig && engineConfig.versions.microlearning)
        );
        progression = action.payload;
      }

      if (type === RESTRICTED_RESOURCE_TYPE.LEVEL) {
        // $FlowFixMe union type
        const level: LevelAPI = await services.Content.find(type, ref);

        // $FlowFixMe await on dispatched action
        const action: {payload: Progression} = await dispatch(
          // $FlowFixMe wrong action
          createLevelProgression(level, engineConfig && engineConfig.versions.learner)
        );
        progression = action.payload;
      }
    }

    if (!progression || !progression._id) {
      throw new Error('Progression has not been created');
    }

    // $FlowFixMe wrong action
    await dispatch(selectProgression(progression._id));
    // $FlowFixMe wrong action
    await dispatch(fetchBestProgression({type, ref}, progression._id, true));

    return dispatch({
      type: CREATE_NEXT_SUCCESS,
      meta: {type, ref}
    });
  } catch (e) {
    return dispatch({
      type: CREATE_NEXT_FAILURE,
      payload: e,
      error: true,
      meta: {type, ref}
    });
  }
};
