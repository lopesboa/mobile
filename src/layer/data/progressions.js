// @flow

import {AsyncStorage} from 'react-native';

import type {Progression} from '@coorpacademy/progression-engine';

export const buildLastProgressionKey = (engineRef: string, contentRef: string) =>
  `last_progression_${engineRef}_${contentRef}`;

export const buildProgressionKey = (progressionId: string) => `progression_${progressionId}`;

const findById = async (id: string) => {
  const progression = await AsyncStorage.getItem(buildProgressionKey(id));
  if (!progression) throw new Error('Progression not found');
  return JSON.parse(progression);
};

const getAll = async () => {
  const progressionRegex = new RegExp(`^(progression_(.+)+)`, 'gm');
  const keys = await AsyncStorage.getAllKeys();
  const filtredKeys = keys.filter(key => key.match(progressionRegex));
  const items = await AsyncStorage.multiGet(filtredKeys);
  return items;
};

const save = async (progression: Progression) => {
  if (!progression._id) throw new Error('progression has not id');

  await AsyncStorage.setItem(buildProgressionKey(progression._id), JSON.stringify(progression));
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
    nextContent.type === 'success' ||
    nextContent.type === 'failure' ||
    (nextContent.type === 'node' && nextContent.ref === 'extraLife')
  ) {
    return null;
  }

  return progression;
};

export {save, getAll, findById, findLast};
