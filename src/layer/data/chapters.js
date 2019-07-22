// @flow strict

import type {ChapterAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {mapToChapterAPI} from './mappers';
import {getItem, getItemsPerResourceType} from './core';
import {CONTENT_TYPE} from './_const';
import type {Chapter, Discipline} from './_types';
import {findByChapter as findDisciplineByChapter} from './disciplines';

export const findById = (userLanguage: SupportedLanguage) => async (
  universalRef: string
): Promise<ChapterAPI> => {
  // $FlowFixMe union type
  const item: Chapter = await getItem(CONTENT_TYPE.CHAPTER, userLanguage, universalRef);
  return item && mapToChapterAPI(item);
};

export const find = (userLanguage: SupportedLanguage) => async (): Promise<Array<ChapterAPI>> => {
  const chapters: Array<Chapter> = await getItemsPerResourceType(
    CONTENT_TYPE.CHAPTER,
    userLanguage
  );
  return chapters.map(mapToChapterAPI);
};

export const getNextChapter = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<ChapterAPI | void> => {
  const discipline: Discipline | void = await findDisciplineByChapter(userLanguage)(ref);

  if (!discipline) {
    return;
  }

  const chapterIds = discipline.modules.reduce((result, mod) => result.concat(mod.chapterIds), []);

  const current = chapterIds.indexOf(ref);
  const nextChapterRef = chapterIds[current + 1];

  if (!nextChapterRef) {
    return;
  }

  return findById(userLanguage)(nextChapterRef);
};
