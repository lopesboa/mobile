// @flow strict

import type {CardStatus, CardType, RestrictedResourceType} from './_types';

export type ContentType = 'chapter' | 'slide' | 'level' | 'exitNode' | 'discipline' | 'chapterRule';

// eslint-disable-next-line import/prefer-default-export
export const CONTENT_TYPE: {[key: string]: ContentType} = {
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule'
};

export const CARD_STATUS: {[key: string]: CardStatus} = {
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive'
};

export const CARD_TYPE: {[key: string]: CardType} = {
  COURSE: 'course',
  CHAPTER: 'chapter'
};

export const RESTRICTED_RESOURCE_TYPE: {[key: string]: RestrictedResourceType} = {
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline'
};
