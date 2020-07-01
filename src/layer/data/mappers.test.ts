import type {
  ChapterAPI,
  SlideAPI,
  ExitNodeAPI,
  LevelAPI,
  LessonAPI,
} from '../../types/coorpacademy/player-services';

import type {Resource} from '../../types';
import {createQCM} from '../../__fixtures__/questions';
import {createLevel} from '../../__fixtures__/levels';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {createVideo} from '../../__fixtures__/lessons';
import {createExitNode} from '../../__fixtures__/exit-nodes';
import {
  mapToChapterAPI,
  mapToSlideAPI,
  mapToExitNodeAPI,
  mapToLessonAPI,
  mapToLevelAPI,
  mapToResource,
} from './mappers';
import {EXIT_NODE_TYPE} from './_const';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1']});
const lesson = createVideo({ref: 'les_1'});
const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
const question = createQCM({});
const slide = createSlide({ref: 'sli_1', chapterId: 'cha_1', question, lessons: [lesson]});

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
  external_refs: level.external_refs,
};

export const mapToChapterAPIExpectedResult: ChapterAPI = {
  _id: chapter._id,
  universalRef: chapter.universalRef,
  name: chapter.name,
  stars: chapter.stars,
  freeRun: chapter.freeRun,
  meta: chapter.meta,
  poster: chapter.poster,
  isConditional: chapter.isConditional,
  time: chapter.time,
  version: chapter.version,
};

export const mapToExitNodeAPIExpectedResult: ExitNodeAPI = {
  ref: failureExitNode.ref,
  type: failureExitNode.type,
  meta: failureExitNode.meta,
  title: failureExitNode.title,
  description: failureExitNode.description,
  media: failureExitNode.media,
};

export const mapToLessonAPIExpectedResult: LessonAPI = {
  _id: lesson._id,
  description: lesson.description,
  mediaRef: lesson.mediaRef,
  mediaUrl: lesson.mediaUrl,
  downloadUrl: lesson.downloadUrl,
  mimeType: lesson.mimeType,
  poster: lesson.poster,
  posters: lesson.posters,
  ref: lesson.ref,
  src: lesson.src,
  subtitles: lesson.subtitles,
  type: lesson.type,
  videoId: lesson.videoId,
};

export const mapToSlideAPIExpectedResult: SlideAPI = {
  _id: slide._id,
  chapter_id: slide.chapter_id,
  klf: slide.klf,
  authors: slide.authors,
  lessons: slide.lessons.map((item) => mapToLessonAPIExpectedResult),
  meta: slide.meta,
  tips: slide.tips,
  clue: slide.clue,
  context: slide.context,
  question: slide.question,
  position: slide.position,
};

export const mapToResourceExpectedResult: Resource = {
  ...lesson,
  url: 'https://content.jwplatform.com/videos/KovTu3zU.mp4',
};

describe('mappers', () => {
  it('should map to chapter API', () => {
    const result = mapToChapterAPI(chapter);
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });

  it('should map to lesson API', () => {
    const result = mapToLessonAPI(lesson);
    expect(result).toEqual(mapToLessonAPIExpectedResult);
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

  it('should map to resource', () => {
    const result = mapToResource(lesson);
    expect(result).toEqual(mapToResourceExpectedResult);
  });
});

export default {
  mapToLevelAPIExpectedResult,
  mapToChapterAPIExpectedResult,
  mapToSlideAPIExpectedResult,
  mapToExitNodeAPIExpectedResult,
};
