import {SlideAPI, ChapterAPI, LevelAPI} from '@coorpacademy/player-services';

import translations from '../../translations';
import {RestrictedResourceType, Level, Chapter, Slide} from './_types';
import {CONTENT_TYPE} from './_const';
import {getItem} from './core';

import {mapToLevelAPI, mapToChapterAPI, mapToSlideAPI} from './mappers';

export const find = async (
  resourceType: RestrictedResourceType,
  ref: string,
): Promise<ChapterAPI | LevelAPI | SlideAPI | void> => {
  const language = translations.getLanguage();
  // @ts-ignore exact type vs inexact type
  const resource = await getItem(resourceType, language, ref);

  if (!resource) {
    return undefined;
  }

  switch (resourceType) {
    case CONTENT_TYPE.LEVEL: {
      const level: Level = resource;
      return mapToLevelAPI(level);
    }
    case CONTENT_TYPE.CHAPTER: {
      const chapter: Chapter = resource;
      return mapToChapterAPI(chapter);
    }
    case CONTENT_TYPE.SLIDE: {
      const slide: Slide = resource;
      return mapToSlideAPI(slide);
    }
    default:
      throw new Error(`${resourceType} not implemented`);
  }
};
export default find;
