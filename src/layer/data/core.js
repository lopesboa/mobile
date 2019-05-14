// @flow strict

import {AsyncStorage} from 'react-native';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import type {SupportedLanguage} from '../../translations/_types';
import type {BundledDiscipline, Resource, ResourceType, Level, Discipline} from './_types';
import {CONTENT_TYPE} from './_const';

export const buildKeyValuePair = (
  resourceType: ResourceType,
  language: SupportedLanguage,
  resource: {[key: string]: Resource}
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(resource);
  return keys.map(key => [`${resourceType}:${language}:${key}`, JSON.stringify(resource[key])]);
};

export const buildLevels = (
  levels: Array<Level>,
  language: SupportedLanguage
): Array<Array<string>> =>
  levels.map(item => [`${CONTENT_TYPE.LEVEL}:${language}:${item.ref}`, JSON.stringify(item)]);

export const mapToResourceType = (value: string): ResourceType => {
  switch (value) {
    case 'chapters':
      return CONTENT_TYPE.CHAPTER;

    case 'disciplines':
      return CONTENT_TYPE.DISCIPLINE;

    case 'exitNodes':
      return CONTENT_TYPE.EXIT_NODE;

    case 'slides':
      return CONTENT_TYPE.SLIDE;

    case 'chapterRules':
      return CONTENT_TYPE.CHAPTER_RULE;
    case 'levels':
      return CONTENT_TYPE.LEVEL;

    default:
      throw new Error(`current type ${value} not supported`);
  }
};

export const createReduceToNormalizedItemFunction = (
  bundledResource: BundledDiscipline,
  language: SupportedLanguage
) => (accumulator: Array<Array<string>>, currentValue: string): Array<Array<string>> => {
  let levels = [];
  if (currentValue === 'disciplines') {
    // $FlowFixMe bundleResource.discipline is not mixed
    const disciplines: Array<Discipline> = Object.values(bundledResource.disciplines);
    levels = buildLevels(
      disciplines.reduce((result, discipline) => result.concat(discipline.modules), []),
      language
    );
  }
  return accumulator.concat(
    buildKeyValuePair(
      mapToResourceType(currentValue),
      language,
      // $FlowFixMe
      bundledResource[currentValue]
    ),
    levels
  );
};

export const normalizeDisciplineBundle = (
  bundledResource: BundledDiscipline,
  language: SupportedLanguage
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(bundledResource);
  const result = keys.reduce(createReduceToNormalizedItemFunction(bundledResource, language), []);
  return result;
};

export const storeDisciplineBundle = async (
  bundledDiscipline: BundledDiscipline,
  language: SupportedLanguage
): Promise<void> => {
  const normalizedBundle = normalizeDisciplineBundle(bundledDiscipline, language);
  try {
    // eslint-disable-next-line no-console
    console.debug('Storing:', normalizedBundle.map(item => item[0]));
    await AsyncStorage.multiSet(normalizedBundle);
  } catch (e) {
    throw new Error('could not store the provided bundledResource');
  }
};

export const fetchDisciplineBundle = async (
  ref: string,
  language: SupportedLanguage,
  token: string,
  host: string
): Promise<BundledDiscipline> => {
  if (__E2E__) {
    if (Object.keys(disciplinesBundle.disciplines).includes(ref)) {
      return Promise.resolve(disciplinesBundle);
    }
  }

  const response = await fetch(
    `${host}/api/v2/disciplines/bundle?lang=${language}&conditions={"ref": ["${ref}"]}`,
    {
      headers: {authorization: token}
    }
  );
  const body = await response.json();
  return body;
};

export const buildKey = (
  resourceType: ResourceType,
  language: SupportedLanguage,
  resourceReference: string
) => {
  return `${resourceType}:${language}:${resourceReference}`;
};

export const getItem = async (
  resourceType: ResourceType,
  resourceReference: string,
  language: SupportedLanguage
): Promise<Resource> => {
  const key = buildKey(resourceType, language, resourceReference);

  try {
    const item = await AsyncStorage.getItem(key);
    return JSON.parse(item);
  } catch (e) {
    throw new Error(`resource not found with ${resourceReference}`);
  }
};

export const filterKeys = (regex: RegExp, keys: Array<string>): Array<string> =>
  keys.filter((key: string) => key.match(regex));

export const getItemsPerResourceType = async (
  resourceType: ResourceType,
  language: SupportedLanguage
) => {
  const allKeys = await AsyncStorage.getAllKeys();
  const regex = new RegExp(`^(${resourceType}:${language}:(.+)+)`, 'gm');
  const filtredKeys = filterKeys(regex, allKeys);
  const retrivedValues = await AsyncStorage.multiGet(filtredKeys);
  return retrivedValues.map(item => JSON.parse(item[1]));
};

export default {
  getItem,
  getItemsPerResourceType
};
