// @flow strict
import type {ChapterAPI, SlideAPI, ExitNodeAPI, LevelAPI} from '@coorpacademy/player-services';

import {chapter_4yiDgZ4cH} from '../../__fixtures__/chapters';

import {slide_sli_415pDBG2r} from '../../__fixtures__/slides';

import {failureExitNode} from '../../__fixtures__/exit-nodes';

import {levelNkOL1WE5r} from '../../__fixtures__/levels';

import {
  mapToChapterAPI,
  mapToSlideAPI,
  mapToExitNodeAPI,
  mapToLessonAPI,
  mapToLevelAPI
} from './mappers';

// eslint-disable-next-line import/prefer-default-export
export const mapToChapterAPIExpectedResult: ChapterAPI = {
  _id: chapter_4yiDgZ4cH._id,
  __v: chapter_4yiDgZ4cH.__v,
  universalRef: chapter_4yiDgZ4cH.universalRef,
  name: chapter_4yiDgZ4cH.name,
  stars: chapter_4yiDgZ4cH.stars,
  freeRun: chapter_4yiDgZ4cH.freeRun,
  meta: chapter_4yiDgZ4cH.meta,
  poster: chapter_4yiDgZ4cH.poster,
  isConditional: chapter_4yiDgZ4cH.isConditional,
  time: chapter_4yiDgZ4cH.time,
  version: chapter_4yiDgZ4cH.version
};

export const mapToSlideAPIExpectedResult: SlideAPI = {
  _id: slide_sli_415pDBG2r._id,
  chapter_id: slide_sli_415pDBG2r.chapter_id,
  klf: slide_sli_415pDBG2r.klf,
  authors: slide_sli_415pDBG2r.authors,
  lessons: slide_sli_415pDBG2r.lessons.map(mapToLessonAPI),
  meta: slide_sli_415pDBG2r.meta,
  tips: slide_sli_415pDBG2r.tips,
  question: slide_sli_415pDBG2r.question,
  position: slide_sli_415pDBG2r.position
};

export const mapToExitNodeAPIExpectedResult: ExitNodeAPI = {
  ref: failureExitNode.ref,
  type: failureExitNode.type,
  meta: failureExitNode.meta,
  title: failureExitNode.title,
  description: failureExitNode.description,
  media: failureExitNode.media
};

export const mapToLevelAPIExpectedResult: LevelAPI = {
  _id: levelNkOL1WE5r._id,
  universalRef: levelNkOL1WE5r.universalRef,
  disciplineRef: levelNkOL1WE5r.disciplineRef,
  ref: levelNkOL1WE5r.ref,
  name: levelNkOL1WE5r.name,
  level: levelNkOL1WE5r.level,
  meta: levelNkOL1WE5r.meta,
  poster: levelNkOL1WE5r.poster,
  chapterIds: levelNkOL1WE5r.chapterIds,
  levelTranslation: levelNkOL1WE5r.levelTranslation,
  mediaUrl: levelNkOL1WE5r.mediaUrl,
  timeAlloted: levelNkOL1WE5r.timeAlloted,
  eligibleBattle: levelNkOL1WE5r.eligibleBattle,
  creditsToAccess: levelNkOL1WE5r.creditsToAccess,
  infiniteLives: levelNkOL1WE5r.infiniteLives,
  isConditional: levelNkOL1WE5r.isConditional,
  acquiredSkills: levelNkOL1WE5r.acquiredSkills,
  data: levelNkOL1WE5r.data,
  stats: levelNkOL1WE5r.stats,
  version: levelNkOL1WE5r.version,
  external_refs: levelNkOL1WE5r.external_refs
};

describe('mappers', () => {
  it('should map to chapter API', () => {
    const result = mapToChapterAPI(chapter_4yiDgZ4cH);
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });

  it('should map to chapter API', () => {
    const result = mapToChapterAPI(chapter_4yiDgZ4cH);
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });

  it('should map to slide API', () => {
    const result = mapToSlideAPI(slide_sli_415pDBG2r);
    expect(result).toEqual(mapToSlideAPIExpectedResult);
  });

  it('should map to ExitNode', () => {
    const result = mapToExitNodeAPI(failureExitNode);
    expect(result).toEqual(mapToExitNodeAPIExpectedResult);
  });

  it('should map to ExitNode', () => {
    const result = mapToLevelAPI(levelNkOL1WE5r);
    expect(result).toEqual(mapToLevelAPIExpectedResult);
  });
});
