// @flow

import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplineStore
} from '@coorpacademy/player-store';
import type {Slide as SlideEngine, Lesson as LessonEngine} from '@coorpacademy/progression-engine';
import type {Level, Slide, Lesson, Chapter, Discipline} from '../../layer/data/_types';

export const mapToLevel = (rawLevel: Level): LevelStore => ({
  _id: rawLevel._id,
  universalRef: rawLevel.universalRef,
  ref: rawLevel.ref,
  name: rawLevel.name,
  level: rawLevel.level,
  meta: rawLevel.meta,
  poster: rawLevel.poster,
  chapterIds: rawLevel.chapterIds,
  levelTranslation: rawLevel.levelTranslation,
  mediaUrl: rawLevel.mediaUrl,
  timeAlloted: rawLevel.timeAlloted,
  eligibleBattle: rawLevel.eligibleBattle,
  creditsToAccess: rawLevel.creditsToAccess,
  infiniteLives: rawLevel.infiniteLives,
  isConditional: rawLevel.isConditional,
  acquiredSkills: rawLevel.acquiredSkills,
  data: rawLevel.data,
  stats: rawLevel.stats,
  version: rawLevel.version,
  external_refs: rawLevel.external_refs
});

export const mapToLesson = (rawLesson: Lesson): LessonEngine => ({
  _id: rawLesson._id,
  description: rawLesson.description,
  mediaUrl: rawLesson.mediaUrl,
  mimeType: rawLesson.mimeType,
  poster: rawLesson.poster,
  posters: rawLesson.posters,
  ref: rawLesson.ref,
  src: rawLesson.src,
  subtitles: rawLesson.subtitles,
  type: rawLesson.type,
  videoId: rawLesson.videoId
});

export const mapToSlide = (rawSlide: Slide): SlideEngine => ({
  _id: rawSlide._id,
  chapter_id: rawSlide.chapter_id,
  klf: rawSlide.klf,
  authors: rawSlide.authors,
  lessons: rawSlide.lessons.map(mapToLesson),
  meta: rawSlide.meta,
  tips: rawSlide.tips,
  clue: rawSlide.clue,
  question: rawSlide.question,
  position: rawSlide.position
});

export const mapToChapter = (rawChapter: Chapter): ChapterStore => ({
  _id: rawChapter._id,
  __v: rawChapter.__v,
  universalRef: rawChapter.universalRef,
  name: rawChapter.name,
  stars: rawChapter.stars,
  freeRun: rawChapter.freeRun,
  meta: rawChapter.meta,
  poster: rawChapter.poster,
  isConditional: rawChapter.isConditional,
  time: rawChapter.time,
  version: rawChapter.version
});

export const mapToDiscipline = (rawDiscipline: Discipline): DisciplineStore => ({
  _id: rawDiscipline._id,
  ref: rawDiscipline.ref,
  universalRef: rawDiscipline.universalRef,
  name: rawDiscipline.name,
  partnershipType: rawDiscipline.partnershipType,
  deliverCoachStatus: rawDiscipline.deliverCoachStatus,
  hidden: rawDiscipline.hidden,
  __v: rawDiscipline.__v,
  position: rawDiscipline.position,
  conditions: rawDiscipline.conditions,
  skills: rawDiscipline.skills,
  groups: rawDiscipline.groups,
  stats: rawDiscipline.stats,
  meta: rawDiscipline.meta,
  partners: rawDiscipline.partners,
  modules: rawDiscipline.modules.map(mapToLevel),
  cover: rawDiscipline.cover,
  version: rawDiscipline.version
});
