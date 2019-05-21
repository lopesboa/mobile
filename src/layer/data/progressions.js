// @flow

import {AsyncStorage} from 'react-native';
import type {Progression, Action} from '@coorpacademy/progression-engine';

import fetch from '../../modules/fetch';
import {isDone, isFailure} from '../../utils/progressions';
import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../../const';
import type {SupportedLanguage} from '../../translations/_types';
import type {Completion} from './_types';
import {getItem} from './core';

export const buildCompletionKey = (engineRef: string, contentRef: string) =>
  `completion_${engineRef}_${contentRef}`;

export const mapProgressionToCompletion = (progression: Progression): Completion => {
  const {state} = progression;
  if (!state) {
    throw new Error('the progression got no state');
  }

  const {current} = state.step;
  return {
    current: isFailure(progression) || current === 0 ? 0 : current - 1,
    stars: state.stars
  };
};

export const mergeCompletion = (
  previousCompletion: Completion,
  latestCompletion: Completion
): Completion => {
  return {
    current: latestCompletion.current,
    stars: Math.max(previousCompletion.stars, latestCompletion.stars)
  };
};

export const storeOrReplaceCompletion = async (progression: Progression): Promise<Completion> => {
  const completionKey = buildCompletionKey(progression.engine.ref, progression.content.ref);
  const stringifiedCompletion = await AsyncStorage.getItem(completionKey);

  if (stringifiedCompletion) {
    const mergedCompletion = mergeCompletion(
      JSON.parse(stringifiedCompletion),
      mapProgressionToCompletion(progression)
    );
    await AsyncStorage.mergeItem(completionKey, JSON.stringify(mergedCompletion));
    return mergedCompletion;
  }

  const completion = mapProgressionToCompletion(progression);
  await AsyncStorage.setItem(completionKey, JSON.stringify(completion));
  return completion;
};

export const buildLastProgressionKey = (engineRef: string, contentRef: string) =>
  `last_progression_${engineRef}_${contentRef}`;

export const buildProgressionKey = (progressionId: string) => `progression_${progressionId}`;

const findById = async (id: string) => {
  const progression = await AsyncStorage.getItem(buildProgressionKey(id));
  if (!progression) throw new Error('Progression not found');
  return JSON.parse(progression);
};

const getAll = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const filteredKeys = keys.filter(key => key.startsWith('progression'));
  const items = await AsyncStorage.multiGet(filteredKeys);

  return items.map(([key, value]) => {
    return JSON.parse(value);
  });
};

const META = {source: 'mobile'};
const synchronize = async (
  token: string,
  host: string,
  progression: Progression
): Promise<void> => {
  const {_id, content, actions, engine, engineOptions} = progression;

  if (_id === undefined) throw new TypeError('progression has no property _id');

  const response = await fetch(`${host}/api/v2/progressions`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      _id,
      content,
      actions,
      engine,
      engineOptions,
      meta: META
    })
  });

  if (response.status >= 400) throw new Error(response.statusText);

  await AsyncStorage.removeItem(buildProgressionKey(_id));

  return;
};

const addCreatedAtToAction = (progression: Progression): Progression => {
  const now = new Date().toISOString();
  return {
    ...progression,
    actions:
      progression.actions &&
      progression.actions.map(
        (action: Action): Action => {
          // $FlowFixMe spread operator
          return {
            ...action,
            createdAt: action.createdAt || now
          };
        }
      )
  };
};

const persist = async (progression: Progression): Promise<Progression> => {
  const {_id} = progression;
  if (_id === undefined) throw new TypeError('progression has no property _id');

  await AsyncStorage.setItem(buildProgressionKey(_id), JSON.stringify(progression));
  await AsyncStorage.setItem(
    buildLastProgressionKey(progression.engine.ref, progression.content.ref),
    progression._id || ''
  );

  storeOrReplaceCompletion(progression);

  return progression;
};

const save = (progression: Progression): Promise<Progression> =>
  persist(addCreatedAtToAction(progression));

const findLast = async (engineRef: string, contentRef: string) => {
  const key = buildLastProgressionKey(engineRef, contentRef);
  const progressionId = await AsyncStorage.getItem(key);
  if (!progressionId) return null;

  const stringifiedProgression = await AsyncStorage.getItem(buildProgressionKey(progressionId));

  if (!stringifiedProgression) return null;

  // if Progression is on successNode, failureNode or extraLifeNode
  // then skip resuming

  const progression = JSON.parse(stringifiedProgression);

  if (!progression.state) return null;
  const {nextContent} = progression.state;
  if (
    isDone(progression) ||
    (nextContent.type === CONTENT_TYPE.NODE && nextContent.ref === SPECIFIC_CONTENT_REF.EXTRA_LIFE)
  ) {
    return null;
  }

  return progression;
};

const findBestOf = (language: SupportedLanguage) => async (
  engineRef: string,
  contentType: {ref: string, type: string},
  contentRef: string,
  progressionId: string
): Promise<number> => {
  // $FlowFixMe
  const card = await getItem('card', language, contentRef);
  return card && card.stars;
};
export {save, getAll, findById, findLast, findBestOf, synchronize};
