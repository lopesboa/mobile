// @flow

import type {DataLayer as DataLayerBase} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {
  findById as findProgressionById,
  getAll as getAllProgressions,
  save as saveProgression
} from './progressions';
import {find as findContent} from './content';
import {findById as findChapterById} from './chapters';
import {getExitNode} from './exit-nodes';
import {fetchDisciplineBundle, storeDisciplineBundle} from './core';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {find as findRecommendations, getNextLevel} from './recommendations';
import {findById as findLevelById} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';

export type DataLayer = DataLayerBase & {
  fetchDisciplineBundle: typeof fetchDisciplineBundle,
  storeDisciplineBundle: typeof storeDisciplineBundle
};

const createDataLayer = (userLanguage: SupportedLanguage): DataLayer => ({
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
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchDisciplineBundle,
  storeDisciplineBundle
});

export default createDataLayer;
