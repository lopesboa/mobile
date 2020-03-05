// @flow

import type {ChapterAPI, DataLayer as DataLayerBase, LevelAPI} from '@coorpacademy/player-services';
import type {Progression} from '@coorpacademy/progression-engine';

import {
  findById as findProgressionById,
  getAll as getAllProgressions,
  getSynchronizedProgressionIds,
  getPendingProgressionId,
  findRemoteProgressionById,
  save as saveProgression,
  findLast as findLastProgression,
  synchronize as synchronizeProgression,
  findBestOf,
  updateSynchronizedProgressionIds,
  updatePendingProgressionId
} from './progressions';
import {find as findContent} from './content';
import {findById as findChapterById, getNextChapter} from './chapters';
import {getExitNode} from './exit-nodes';
import {fetchBundle, storeBundle} from './bundle';
import {
  fetchCard,
  fetchSectionCards,
  fetchSearchCards,
  refreshCard,
  getCardFromLocalStorage
} from './cards';
import {fetchBrand} from './brand';
import {fetchUser} from './users';
import {findById as findSlideById, findByChapter as findSlideByChapter} from './slides';
import {fetchRecommendation} from './recommendations';
import {findById as findLevelById, getNextLevel} from './levels';
import {getCorrectAnswer} from './answers';
import {getClue} from './clues';
import {logEvent} from './analytics';
import {logError, setProperties as setLoggerProperties} from './logger';
import {setLanguage, getInterfaceLanguage} from './language';
import {fetchSections} from './sections';
import {findUriById as findVideoUriById, findTracksById as findVideoTracksById} from './videos';

export type DataLayer = {
  ...DataLayerBase,
  fetchBundle: typeof fetchBundle,
  storeBundle: typeof storeBundle,
  fetchCard: typeof fetchCard,
  fetchSectionCards: typeof fetchSectionCards,
  fetchSearchCards: typeof fetchSearchCards,
  fetchBrand: typeof fetchBrand,
  setLanguage: typeof setLanguage,
  getInterfaceLanguage: typeof getInterfaceLanguage,
  fetchSections: typeof fetchSections,
  refreshCard: typeof refreshCard,
  getCardFromLocalStorage: typeof getCardFromLocalStorage,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronizeProgression: typeof synchronizeProgression,
  getAllProgressions: typeof getAllProgressions,
  getSynchronizedProgressionIds: typeof getSynchronizedProgressionIds,
  getPendingProgressionId: typeof getPendingProgressionId,
  findRemoteProgressionById: typeof findRemoteProgressionById,
  fetchRecommendation: typeof fetchRecommendation,
  findBestOf: typeof findBestOf,
  getNextChapter: (ref: string) => Promise<ChapterAPI | void>,
  getNextLevel: (ref: string) => Promise<LevelAPI | void>,
  logEvent: typeof logEvent,
  logError: typeof logError,
  setLoggerProperties: typeof setLoggerProperties,
  fetchUser: typeof fetchUser,
  saveProgression: Progression => Promise<Progression>,
  updateSynchronizedProgressionIds: typeof updateSynchronizedProgressionIds,
  updatePendingProgressionId: typeof updatePendingProgressionId
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
  getSynchronizedProgressionIds,
  getPendingProgressionId,
  findRemoteProgressionById,
  saveProgression,
  synchronizeProgression,
  fetchUser,
  // $FlowFixMe  @todo replace with fetchRecommendations
  findRecommendations: () => [],
  getNextChapter,
  getNextLevel,
  findLevelById,
  fetchCard,
  fetchSectionCards,
  fetchSearchCards,
  fetchBrand,
  setLanguage,
  getInterfaceLanguage,
  fetchRecommendation,
  findVideoUriById,
  findVideoTracksById,
  findBestOf,
  findLast: findLastProgression,
  fetchSections,
  refreshCard,
  getCardFromLocalStorage,
  // @todo implement it
  getChapterRulesByContent: () => [],
  fetchBundle,
  storeBundle,
  logEvent,
  logError,
  setLoggerProperties,
  updateSynchronizedProgressionIds,
  updatePendingProgressionId
});

export default createDataLayer;
