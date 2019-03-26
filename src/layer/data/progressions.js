// @flow

import {AsyncStorage} from 'react-native';

import type {Progression} from '@coorpacademy/progression-engine';
import {isDone} from '../../utils/progressions';
import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../../const';

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

const fetchMock = (url: string, init?: RequestOptions): Promise<Response> =>
  Promise.resolve({status: 200});

const synchronize = async (progression: Progression): Promise<void> => {
  const {_id} = progression;
  if (_id === undefined) throw new TypeError('progression has no property _id');

  await fetchMock('some_stupid_url', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorize: 'token here' // place the token here
    },
    body: JSON.stringify(progression)
  });

  await AsyncStorage.removeItem(buildProgressionKey(_id));

  return;
};

const save = async (progression: Progression) => {
  const {_id} = progression;
  if (_id === undefined) throw new TypeError('progression has no property _id');

  await AsyncStorage.setItem(buildProgressionKey(_id), JSON.stringify(progression));
  await AsyncStorage.setItem(
    buildLastProgressionKey(progression.engine.ref, progression.content.ref),
    buildProgressionKey(progression._id || '')
  );

  return progression;
};

const findLast = async (engineRef: string, contentRef: string) => {
  const key = buildLastProgressionKey(engineRef, contentRef);
  const progressionId = await AsyncStorage.getItem(key);
  if (!progressionId) return null;

  const stringifiedProgression = await AsyncStorage.getItem(buildProgressionKey(progressionId));

  if (!stringifiedProgression) return null;

  // if Progression is on successNode, failureNode or extraLifeNode
  // then skip resuming

  const progression = JSON.parse(stringifiedProgression);
  const {nextContent} = progression.state;
  if (
    isDone(progression) ||
    (nextContent.type === CONTENT_TYPE.NODE && nextContent.ref === SPECIFIC_CONTENT_REF.EXTRA_LIFE)
  ) {
    return null;
  }

  return progression;
};

export {save, getAll, findById, findLast, synchronize};
