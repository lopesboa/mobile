// @flow strict

import type {ChapterAPI, SlideAPI, ExitNodeAPI, LevelAPI} from '@coorpacademy/player-services';

import {createQCM} from '../../__fixtures__/questions';
import {createLevel} from '../../__fixtures__/levels';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {failureExitNode} from '../../__fixtures__/exit-nodes';

import {
  mapToChapterAPI,
  mapToSlideAPI,
  mapToExitNodeAPI,
  mapToLessonAPI,
  mapToLevelAPI
} from './mappers';

const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1']});
const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
const question = createQCM({});
const slide = createSlide({ref: 'sli_1', chapterId: 'cha_1', question});

// eslint-disable-next-line import/prefer-default-export
export const mapToLevelAPIExpectedResult: LevelAPI = {
  _id: level._id,
  universalRef: level.universalRef,
  disciplineRef: level.disciplineRef,
  ref: level.ref,
  name: level.name,
  level: level.level,
  meta: level.meta,
  poster: level.poster,
  chapterIds: level.chapterIds,
  levelTranslation: level.levelTranslation,
  mediaUrl: level.mediaUrl,
  timeAlloted: level.timeAlloted,
  eligibleBattle: level.eligibleBattle,
  creditsToAccess: level.creditsToAccess,
  infiniteLives: level.infiniteLives,
  isConditional: level.isConditional,
  acquiredSkills: level.acquiredSkills,
  data: level.data,
  stats: level.stats,
  version: level.version,
  external_refs: level.external_refs
};

export const mapToChapterAPIExpectedResult: ChapterAPI = {
  _id: chapter._id,
  __v: chapter.__v,
  universalRef: chapter.universalRef,
  name: chapter.name,
  stars: chapter.stars,
  freeRun: chapter.freeRun,
  meta: chapter.meta,
  poster: chapter.poster,
  isConditional: chapter.isConditional,
  time: chapter.time,
  version: chapter.version
};

export const mapToSlideAPIExpectedResult: SlideAPI = {
  _id: slide._id,
  chapter_id: slide.chapter_id,
  klf: slide.klf,
  authors: slide.authors,
  lessons: slide.lessons.map(mapToLessonAPI),
  meta: slide.meta,
  tips: slide.tips,
  clue: slide.clue,
  question: slide.question,
  position: slide.position
};

export const mapToExitNodeAPIExpectedResult: ExitNodeAPI = {
  ref: failureExitNode.ref,
  type: failureExitNode.type,
  meta: failureExitNode.meta,
  title: failureExitNode.title,
  description: failureExitNode.description,
  media: failureExitNode.media
};

describe('mappers', () => {
  it('should map to chapter API', () => {
    const result = mapToChapterAPI(chapter);
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });

  it('should map to chapter API', () => {
    const result = mapToChapterAPI(chapter);
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });

  it('should map to slide API', () => {
    const result = mapToSlideAPI(slide);
    expect(result).toEqual(mapToSlideAPIExpectedResult);
  });

  it('should map to ExitNode', () => {
    const result = mapToExitNodeAPI(failureExitNode);
    expect(result).toEqual(mapToExitNodeAPIExpectedResult);
  });

  it('should map to ExitNode', () => {
    const result = mapToLevelAPI(level);
    expect(result).toEqual(mapToLevelAPIExpectedResult);
  });
});

export default {
  mapToLevelAPIExpectedResult,
  mapToChapterAPIExpectedResult,
  mapToSlideAPIExpectedResult,
  mapToExitNodeAPIExpectedResult
};
