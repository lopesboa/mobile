// @flow

import noop from 'lodash/fp/noop';

import type {DataLayer} from '@coorpacademy/player-services';
import {
  findById as findProgressionById,
  getAll as getAllProgressions,
  save as saveProgression
} from './progressions';

import {find as findContent} from './content';
import {findById as findChapterById} from './chapters';
import {getExitNode} from './exit-nodes';
import {fetchDisciplineBundle} from './core';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';

import {find as findRecommendations, getNextLevel} from './recommendations';

import {findById as findLevelById} from './levels';

import {getCorrectAnswer} from './answers';

import {getClue} from './clues';

import type {
  BundledDiscipline,
  Language,
  Resource,
  Level,
  ResourceType,
  Slide,
  Lesson,
  Chapter,
  ExitNode,
  Discipline,
  RestrictedResourceType
} from './types';

const getChapterRulesByContent = noop;

const createDataLayer = (userLanguage: Language): DataLayer => ({
  fetchDisciplineBundle: fetchDisciplineBundle(userLanguage),
  getExitNode: getExitNode(userLanguage),
  findSlideById: findSlideById(userLanguage),
  findSlideByChapter: findSlideByChapter(userLanguage),
  findChapterById: findChapterById(userLanguage),
  findContent: findContent(userLanguage),
  getCorrectAnswer: getCorrectAnswer(userLanguage),
  getClue: getClue(userLanguage),
  findProgressionById,
  getAllProgressions,
  saveProgression,
  findRecommendations,
  getNextLevel,
  findLevelById: findLevelById(userLanguage),
  getChapterRulesByContent
});

export type {
  BundledDiscipline,
  DataLayer,
  Slide,
  Resource,
  Level,
  Discipline,
  Chapter,
  Lesson,
  ResourceType,
  RestrictedResourceType,
  ExitNode
};
export default createDataLayer;
