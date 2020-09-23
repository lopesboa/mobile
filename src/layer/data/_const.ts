export type ContentType = 'chapter' | 'slide' | 'level' | 'exitNode' | 'discipline' | 'chapterRule';

export const CONTENT_TYPE = <const>{
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  LEVEL: 'level',
  EXIT_NODE: 'exitNode',
  DISCIPLINE: 'discipline',
  CHAPTER_RULE: 'chapterRule',
};

export const CARD_STATUS = <const>{
  STARTED: 'isStarted',
  LOCKED: 'isLocked',
  ACTIVE: 'isActive',
};

export const CARD_TYPE = <const>{
  COURSE: 'course',
  CHAPTER: 'chapter',
};

export const RESTRICTED_RESOURCE_TYPE = <const>{
  LEVEL: 'level',
  CHAPTER: 'chapter',
  SLIDE: 'slide',
  DISCIPLINE: 'discipline',
};

export const VIDEO_PROVIDER = <const>{
  KONTIKI: 'kontiki',
  JWPLAYER: 'jwplayer',
  VIMEO: 'vimeo',
  YOUTUBE: 'youtube',
  OMNIPLAYER: 'omniPlayer',
};

export const EXIT_NODE_TYPE = <const>{
  SUCCESS: 'success',
  FAILURE: 'failure',
};
