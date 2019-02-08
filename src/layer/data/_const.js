// @flow strict

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
