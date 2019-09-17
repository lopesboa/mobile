// @flow

import type {ChapterAPI, DataLayer as DataLayerBase, LevelAPI} from '@coorpacademy/player-services';
import type {Progression} from '@coorpacademy/progression-engine';
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
import {fetchUser} from './users';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {find as findRecommendations} from './recommendations';
import {findById as findLevelById, getNextLevel} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';
import {logEvent} from './analytics';
import {fetchLanguage, setLanguage, getInterfaceLanguage} from './language';
import {fetchSections} from './sections';
import {findUriById as findVideoUriById} from './videos';

export type DataLayer = {
  ...DataLayerBase,
  fetchBundle: typeof fetchBundle,
  storeBundle: typeof storeBundle,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand,
  fetchLanguage: typeof fetchLanguage,
  setLanguage: typeof setLanguage,
  getInterfaceLanguage: typeof getInterfaceLanguage,
  fetchSections: typeof fetchSections,
  refreshCard: typeof refreshCard,
  getCardFromLocalStorage: typeof getCardFromLocalStorage,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronizeProgression: typeof synchronizeProgression,
  getAllProgressions: typeof getAllProgressions,
  findBestOf: () => Promise<number>,
  getNextChapter: (ref: string) => Promise<ChapterAPI | void>,
  getNextLevel: (ref: string) => Promise<LevelAPI | void>,
  logEvent: typeof logEvent,
  fetchUser: typeof fetchUser
};

const createDataLayer = (): DataLayer => ({
  getExitNode,
  findSlideById,
  findSlideByChapter,
  findChapterById,
  findContent,
  getCorrectAnswer,
  getClue,
  findProgressionById,
  getAllProgressions,
  saveProgression,
  synchronizeProgression,
  fetchUser,
  findRecommendations,
  getNextChapter,
  getNextLevel,
  findLevelById,
  fetchCards,
  fetchBrand,
  fetchLanguage,
  setLanguage,
  getInterfaceLanguage,
  findVideoUriById,
  // $FlowFixMe
  findBestOf: findBestOf,
  findLast: findLastProgression,
  fetchSections,
  refreshCard,
  getCardFromLocalStorage,
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchBundle,
  storeBundle,
  logEvent
});

export default createDataLayer;
