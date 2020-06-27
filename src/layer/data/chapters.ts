import type {ChapterAPI} from '@coorpacademy/player-services';

import translations from '../../translations';
import {mapToChapterAPI} from './mappers';
import {getItem, getItemsPerResourceType} from './core';
import {CONTENT_TYPE} from './_const';
import type {Chapter, Discipline} from './_types';
import {findByChapter as findDisciplineByChapter} from './disciplines';

export const findById = async (universalRef: string): Promise<ChapterAPI> => {
  const language = translations.getLanguage();
  // @ts-ignore union type
  const item: Chapter = await getItem(CONTENT_TYPE.CHAPTER, language, universalRef);
  return item && mapToChapterAPI(item);
};

export const find = async (): Promise<Array<ChapterAPI>> => {
  const language = translations.getLanguage();
  const chapters: Array<Chapter> = await getItemsPerResourceType(CONTENT_TYPE.CHAPTER, language);
  return chapters.map(mapToChapterAPI);
};

export const getNextChapter = async (ref: string): Promise<ChapterAPI | void> => {
  const discipline: Discipline | void = await findDisciplineByChapter(ref);

  if (!discipline) {
    return;
  }

  const chapterIds = discipline.modules.reduce((result, mod) => result.concat(mod.chapterIds), []);

  const current = chapterIds.indexOf(ref);
  const nextChapterRef = chapterIds[current + 1];

  if (!nextChapterRef) {
    return;
  }

  return findById(nextChapterRef);
};
