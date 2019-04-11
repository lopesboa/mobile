// @flow strict

import type {CardStatus, CardType, RestrictedResourceType} from './_types';

export type ContentType = 'chapter' | 'slide' | 'level' | 'exitNode' | 'discipline' | 'chapterRule';

export const CONTENT_TYPE: {|
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule'
|} = {
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule'
};
// FlowAssert
(Object.keys(CONTENT_TYPE).map(k => CONTENT_TYPE[k]): Array<ContentType>);

export const CARD_STATUS: {|
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive'
|} = {
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive'
};
// FlowAssert
(Object.keys(CARD_STATUS).map(k => CARD_STATUS[k]): Array<CardStatus>);

export const CARD_TYPE: {|
  COURSE: 'course',
  CHAPTER: 'chapter'
|} = {
  COURSE: 'course',
  CHAPTER: 'chapter'
};
// FlowAssert
(Object.keys(CARD_TYPE).map(k => CARD_TYPE[k]): Array<CardType>);

export const RESTRICTED_RESOURCE_TYPE: {|
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline'
|} = {
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline'
};
// FlowAssert
(Object.keys(RESTRICTED_RESOURCE_TYPE).map(
  k => RESTRICTED_RESOURCE_TYPE[k]
): Array<RestrictedResourceType>);
