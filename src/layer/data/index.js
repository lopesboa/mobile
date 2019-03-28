// @flow

import type {DataLayer as DataLayerBase} from '@coorpacademy/player-services';
import type {Progression} from '@coorpacademy/progression-engine';
import type {SupportedLanguage} from '../../translations/_types';
import {
  findById as findProgressionById,
  getAll as getAllProgressions,
  save as saveProgression,
  findLast as findLastProgression,
  synchronize as synchronizeProgression,
  findBestOf
} from './progressions';
import {find as findContent} from './content';
import {findById as findChapterById} from './chapters';
import {getExitNode} from './exit-nodes';
import {fetchDisciplineBundle, storeDisciplineBundle} from './core';
import {fetchCards} from './cards';
import {fetchBrand} from './brand';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {find as findRecommendations, getNextLevel} from './recommendations';
import {findById as findLevelById} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';
import type {DisciplineCard} from './_types';

export type DataLayer = {
  ...DataLayerBase,
  fetchDisciplineBundle: typeof fetchDisciplineBundle,
  storeDisciplineBundle: typeof storeDisciplineBundle,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronizeProgression: typeof synchronizeProgression,
  getAllProgressions: typeof getAllProgressions,
  findBestOf: (language: SupportedLanguage) => Promise<number>,
  getNextLevel: (language: SupportedLanguage) => Promise<DisciplineCard | null>
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
  synchronizeProgression,
  findRecommendations,
  getNextLevel: getNextLevel(userLanguage),
  findLevelById: findLevelById(userLanguage),
  fetchCards,
  fetchBrand,
  // $FlowFixMe
  findBestOf: findBestOf(userLanguage),
  findLast: findLastProgression,
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchDisciplineBundle,
  storeDisciplineBundle
});

export default createDataLayer;
