// @flow strict

import type {SlideAPI, ChapterAPI, LevelAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import type {Resource, RestrictedResourceType} from './_types';
import {CONTENT_TYPE} from './_const';
import {getItem} from './core';

import {mapToLevelAPI, mapToChapterAPI, mapToSlideAPI} from './mappers';

export const find = (userLanguage: SupportedLanguage) => async (
  resourceType: RestrictedResourceType,
  ref: string
): Promise<ChapterAPI | LevelAPI | SlideAPI> => {
  const resource: Resource = await getItem(resourceType, userLanguage, ref);

  switch (resourceType) {
    case CONTENT_TYPE.DISCIPLINE: {
      // $FlowFixMe @todo use generic type there
      const discipline: Discipline = resource;
      return discipline;
    }
    case CONTENT_TYPE.LEVEL: {
      // $FlowFixMe @todo use generic type there
      const level: Level = resource;
      return mapToLevelAPI(level);
    }
    case CONTENT_TYPE.CHAPTER: {
      // $FlowFixMe @todo use generic type there
      const chapter: Chapter = resource;
      return mapToChapterAPI(chapter);
    }
    case CONTENT_TYPE.SLIDE: {
      // $FlowFixMe @todo use generic type there
      const slide: Slide = resource;
      return mapToSlideAPI(slide);
    }
    default:
      throw new Error(`${resourceType} not implemented`);
  }
};
export default find;
