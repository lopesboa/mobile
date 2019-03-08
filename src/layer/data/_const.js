// @flow strict

import type {CardStatus, CardType, RestrictedResourceType} from './_types';

export type ContentType = 'chapter' | 'slide' | 'level' | 'exitNode' | 'discipline' | 'chapterRule';

// eslint-disable-next-line import/prefer-default-export
export const CONTENT_TYPE: {
  [key: 'CHAPTER' | 'SLIDE' | 'LEVEL' | 'EXIT_NODE' | 'DISCIPLINE' | 'CHAPTER_RULE']: ContentType
} = {
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule'
};

export const CARD_STATUS: {[key: 'STARTED' | 'LOCKED' | 'ACTIVE']: CardStatus} = {
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive'
};

export const CARD_TYPE: {[key: 'COURSE' | 'CHAPTER']: CardType} = {
  COURSE: 'course',
  CHAPTER: 'chapter'
};

export const RESTRICTED_RESOURCE_TYPE: {
  [key: 'LEVEL' | 'CHAPTER' | 'SLIDE' | 'DISCIPLINE']: RestrictedResourceType
} = {
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline'
};
