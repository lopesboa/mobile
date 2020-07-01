import type {VideoProvider} from '../../types/coorpacademy/player-services';

import type {CardStatus, CardType, RestrictedResourceType, ExitNodeType} from './_types';

export type ContentType = 'chapter' | 'slide' | 'level' | 'exitNode' | 'discipline' | 'chapterRule';

export const CONTENT_TYPE: {
  CHAPTER: 'chapter';
  SLIDE: 'slide';
  LEVEL: 'level';
  EXIT_NODE: 'exitNode';
  DISCIPLINE: 'discipline';
  CHAPTER_RULE: 'chapterRule';
} = {
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule',
};

export const CARD_STATUS: {
  STARTED: 'isStarted';
  LOCKED: 'isLocked';
  ACTIVE: 'isActive';
} = {
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive',
};

export const CARD_TYPE: {
  COURSE: 'course';
  CHAPTER: 'chapter';
} = {
  COURSE: 'course',
  CHAPTER: 'chapter',
};

export const RESTRICTED_RESOURCE_TYPE: {
  LEVEL: 'level';
  CHAPTER: 'chapter';
  SLIDE: 'slide';
  DISCIPLINE: 'discipline';
} = {
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline',
};

export const VIDEO_PROVIDER: {
  KONTIKI: 'kontiki';
  JWPLAYER: 'jwplayer';
  VIMEO: 'vimeo';
  YOUTUBE: 'youtube';
  OMNIPLAYER: 'omniPlayer';
} = {
  KONTIKI: 'kontiki',
  JWPLAYER: 'jwplayer',
  VIMEO: 'vimeo',
  YOUTUBE: 'youtube',
  OMNIPLAYER: 'omniPlayer',
};

export const EXIT_NODE_TYPE: {
  SUCCESS: 'success';
  FAILURE: 'failure';
} = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};
