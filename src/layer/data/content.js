// @flow
import type {SlideAPI, ChapterAPI, LevelAPI} from '@coorpacademy/player-services';
import type {Language, Resource, RestrictedResourceType} from './types';
import {CONTENT_TYPE} from './_const';

import {getItem} from './core';

import {mapToLevelAPI, mapToChapterAPI, mapToSlideAPI} from './mappers';

export const find = (userLanguage: Language) => async (
  resourceType: RestrictedResourceType,
  ref: string
): Promise<ChapterAPI | LevelAPI | SlideAPI> => {
  const resource: Resource = await getItem(resourceType, ref, userLanguage);

  switch (resourceType) {
    case CONTENT_TYPE.LEVEL:
      // $FlowFixMe
      return mapToLevelAPI(resource);
    case CONTENT_TYPE.CHAPTER:
      // $FlowFixMe
      return mapToChapterAPI(resource);
    case CONTENT_TYPE.SLIDE:
      // $FlowFixMe
      return mapToSlideAPI(resource);
    default:
      throw new Error(`${resourceType} not implemented`);
  }
};
export default find;
