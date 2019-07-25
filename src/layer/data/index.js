// @flow

import type {ChapterAPI, DataLayer as DataLayerBase, LevelAPI} from '@coorpacademy/player-services';
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
import {findById as findChapterById, getNextChapter} from './chapters';
import {getExitNode} from './exit-nodes';
import {fetchBundle, storeBundle} from './bundle';
import {fetchCards, refreshCard, getCardFromLocalStorage} from './cards';
import {fetchBrand} from './brand';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {find as findRecommendations} from './recommendations';
import {findById as findLevelById, getNextLevel} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';
import {logEvent} from './analytics';
import {fetchSections} from './sections';

export type DataLayer = {
  ...DataLayerBase,
  fetchBundle: $Call<typeof fetchBundle, SupportedLanguage>,
  storeBundle: $Call<typeof storeBundle, SupportedLanguage>,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand,
  fetchSections: typeof fetchSections,
  refreshCard: typeof refreshCard,
  getCardFromLocalStorage: typeof getCardFromLocalStorage,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronizeProgression: typeof synchronizeProgression,
  getAllProgressions: typeof getAllProgressions,
  findBestOf: () => Promise<number>,
  getNextChapter: (ref: string) => Promise<ChapterAPI | void>,
  getNextLevel: (ref: string) => Promise<LevelAPI | void>,
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
  getNextChapter: getNextChapter(userLanguage),
  getNextLevel: getNextLevel(userLanguage),
  findLevelById: findLevelById(userLanguage),
  fetchCards,
  fetchBrand,
  // $FlowFixMe
  findBestOf: findBestOf(userLanguage),
  findLast: findLastProgression,
  fetchSections,
  refreshCard,
  getCardFromLocalStorage,
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchBundle: fetchBundle(userLanguage),
  storeBundle: storeBundle(userLanguage),
  logEvent
});

export default createDataLayer;
