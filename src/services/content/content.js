// @flow strict

import {AsyncStorage} from 'react-native';

import type {Chapter, Discipline, BundledDiscipline, Slide, ExitNode, Language} from './types';

type Resource = Chapter | Discipline | Slide | ExitNode;

export const buildKeyValuePair = (
  resourceName: string,
  userLanguage: Language,
  resource: {[key: string]: Resource}
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(resource);
  return keys.map(key => [`${resourceName}:${userLanguage}:${key}`, JSON.stringify(resource[key])]);
};

export const normalizeDisciplineBundle = (
  bundledResource: BundledDiscipline,
  userLanguage: Language
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(bundledResource);
  const reduceFunction = (accumulator, currentValue) =>
    accumulator.concat(
      buildKeyValuePair(currentValue, userLanguage, bundledResource[currentValue])
    );
  return keys.reduce(reduceFunction, []);
};

type StoreDisciplineBundleReturn = BundledDiscipline => Promise<void>;

export const storeDisciplineBundle = (
  userLanguage: Language
): StoreDisciplineBundleReturn => async bundledDiscipline => {
  const normalizedBundle = normalizeDisciplineBundle(bundledDiscipline, userLanguage);
  try {
    await AsyncStorage.multiSet(normalizedBundle);
  } catch (e) {
    throw new Error('could not store the provided bundledResource');
  }
};
