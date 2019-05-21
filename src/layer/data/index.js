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
import {fetchBundle, storeBundle} from './core';
import {fetchCards, refreshCard, getCardFromLocalStorage} from './cards';
import {fetchBrand} from './brand';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {find as findRecommendations, getNextLevel} from './recommendations';
import {findById as findLevelById} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';
import {logEvent} from './analytics';
import type {DisciplineCard} from './_types';

export type DataLayer = {
  ...DataLayerBase,
  fetchBundle: typeof fetchBundle,
  storeBundle: typeof storeBundle,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand,
  refreshCard: typeof refreshCard,
  getCardFromLocalStorage: typeof getCardFromLocalStorage,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronizeProgression: typeof synchronizeProgression,
  getAllProgressions: typeof getAllProgressions,
  findBestOf: (language: SupportedLanguage) => Promise<number>,
  getNextLevel: (language: SupportedLanguage) => Promise<DisciplineCard | void>,
  logEvent: typeof logEvent
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
  refreshCard,
  getCardFromLocalStorage,
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchBundle,
  storeBundle,
  logEvent
});

export default createDataLayer;
