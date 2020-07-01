import AsyncStorage from '@react-native-community/async-storage';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import {getMostAccurateRef} from '../../modules/reference';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import chaptersBundle from '../../__fixtures__/chapter-bundle';
import type {SupportedLanguage} from '../../translations/_types';
import translations from '../../translations';
import {buildKey} from './core';
import type {
  BundledDiscipline,
  BundledChapter,
  Resource,
  ResourceType,
  Level,
  Discipline,
} from './_types';

import {CONTENT_TYPE} from './_const';

export const buildKeyValuePair = (
  resourceType: ResourceType,
  language: SupportedLanguage,
  resource: Record<string, Resource>,
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(resource);
  return keys.map((key) => [buildKey(resourceType, language, key), JSON.stringify(resource[key])]);
};

export const buildLevels = (
  levels: Array<Level>,
  language: SupportedLanguage,
): Array<Array<string>> =>
  levels.map((item) => [
    `${CONTENT_TYPE.LEVEL}:${language}:${getMostAccurateRef(item)}`,
    JSON.stringify(item),
  ]);
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
  bundledResource: BundledDiscipline | BundledChapter,
  language: SupportedLanguage,
) => (accumulator: Array<Array<string>>, currentValue: string): Array<Array<string>> => {
  let levels = [];
  if (currentValue === 'disciplines') {
    // @ts-ignore bundleResource.discipline is not mixed
    const disciplines: Array<Discipline> = Object.values(bundledResource.disciplines);
    levels = buildLevels(
      disciplines.reduce((result, discipline) => result.concat(discipline.modules), []),
      language,
    );
  }
  return accumulator.concat(
    buildKeyValuePair(
      mapToResourceType(currentValue),
      language, // @ts-ignore
      bundledResource[currentValue],
    ),
    levels,
  );
};

export const normalizeBundle = (
  bundledResource: BundledDiscipline | BundledChapter,
  language: SupportedLanguage,
): Array<Array<string>> => {
  const keys: Array<string> = Object.keys(bundledResource);
  return keys.reduce(createReduceToNormalizedItemFunction(bundledResource, language), []);
};

export const storeBundle = async (
  bundledResource: BundledDiscipline | BundledChapter,
): Promise<void> => {
  const language = translations.getLanguage();
  const normalizedBundle = normalizeBundle(bundledResource, language);
  try {
    // eslint-disable-next-line no-console
    console.debug(
      'Storing:',
      normalizedBundle.map((item) => item[0]),
    );
    await AsyncStorage.multiSet(normalizedBundle);
  } catch (e) {
    throw new Error('Could not store the provided resource');
  }
};

export const fetchBundle = async (
  type: typeof CONTENT_TYPE.DISCIPLINE | typeof CONTENT_TYPE.CHAPTER,
  ref: string,
  token: string,
  host: string,
): Promise<BundledDiscipline | BundledChapter> => {
  const language = translations.getLanguage();

  if (__E2E__) {
    if (
      type === CONTENT_TYPE.DISCIPLINE &&
      Object.keys(disciplinesBundle.disciplines).includes(ref)
    ) {
      return Promise.resolve(disciplinesBundle);
    }
    if (type === CONTENT_TYPE.CHAPTER && Object.keys(chaptersBundle.chapters).includes(ref)) {
      return Promise.resolve(chaptersBundle);
    }
  }

  const endpoint = type === CONTENT_TYPE.DISCIPLINE ? 'disciplines' : 'chapters';
  const response = await fetch(
    `${host}/api/v2/${endpoint}/bundle?lang=${language}&conditions={"universalRef": ["${ref}"]}`,
    {
      headers: {authorization: token},
    },
  );
  const body = await response.json();
  return body;
};
