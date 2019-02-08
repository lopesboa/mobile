// @flow strict

import type {ChapterAPI} from '@coorpacademy/player-services';
import {mapToChapterAPI} from './mappers';

import {getItem, getItemsPerResourceType} from './core';
import {CONTENT_TYPE} from './_const';
import type {Chapter, Language} from './types';

export const findById = (userLanguage: Language) => async (
  universalRef: string
): Promise<ChapterAPI> => {
  // $FlowFixMe union type
  const item: Chapter = await getItem(CONTENT_TYPE.CHAPTER, universalRef, userLanguage);
  return mapToChapterAPI(item);
};

export const find = (userLangue: Language) => async (): Promise<Array<ChapterAPI>> => {
  const chapters: Array<Chapter> = await getItemsPerResourceType(CONTENT_TYPE.CHAPTER, userLangue);
  return chapters.map(mapToChapterAPI);
};
