// @flow strict

import type {Level as LevelStore, Chapter as ChapterStore} from '@coorpacademy/player-store';
import type {Slide as SlideEngine} from '@coorpacademy/progression-engine';
import {createQCM} from '../questions';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';

import {mapToChapter, mapToSlide, mapToLesson, mapToLevel} from './mappers';

const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1']});
const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
const question = createQCM({});
const slide = createSlide({ref: 'sli_1', chapterId: 'cha_1', question});

export const mapToLeveExpectedResult: LevelStore = {
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

export const mapToChapterExpectedResult: ChapterStore = {
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

export const mapToSlideExpectedResult: SlideEngine = {
  _id: slide._id,
  chapter_id: slide.chapter_id,
  klf: slide.klf,
  authors: slide.authors,
  lessons: slide.lessons.map(mapToLesson),
  meta: slide.meta,
  tips: slide.tips,
  clue: slide.clue,
  question: slide.question,
  position: slide.position
};

describe('mappers', () => {
  it('should map to chapter', () => {
    const result = mapToChapter(chapter);
    expect(result).toEqual(mapToChapterExpectedResult);
  });

  it('should map to slide', () => {
    const result = mapToSlide(slide);
    expect(result).toEqual(mapToSlideExpectedResult);
  });

  it('should map to Level', () => {
    const result = mapToLevel(level);
    expect(result).toEqual(mapToLeveExpectedResult);
  });
});
