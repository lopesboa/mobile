// @flow

import type {
  ExitNodeAPI,
  ChapterAPI,
  SlideAPI,
  LessonAPI,
  LevelAPI
} from '@coorpacademy/player-services';

import type {ExitNode, Chapter, Slide, Lesson, Level} from './_types';

export const mapToExitNodeAPI = (rawExitNode: ExitNode): ExitNodeAPI => ({
  ref: rawExitNode.ref,
  type: rawExitNode.type,
  meta: rawExitNode.meta,
  title: rawExitNode.title,
  description: rawExitNode.description,
  media: rawExitNode.media
});

export const mapToChapterAPI = (rawChapter: Chapter): ChapterAPI => ({
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

export const mapToLessonAPI = (rawLesson: Lesson): LessonAPI => ({
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

export const mapToLevelAPI = (rawLevel: Level): LevelAPI => ({
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

export const mapToSlideAPI = (rawSlide: Slide): SlideAPI => ({
  _id: rawSlide._id,
  chapter_id: rawSlide.chapter_id,
  klf: rawSlide.klf,
  authors: rawSlide.authors,
  lessons: rawSlide.lessons.map(mapToLessonAPI),
  meta: rawSlide.meta,
  tips: rawSlide.tips,
  clue: rawSlide.clue,
  question: rawSlide.question,
  position: rawSlide.position
});

export default mapToExitNodeAPI;
