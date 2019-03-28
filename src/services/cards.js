// @flow strict

import type {DataLayer} from '../layer/data';
import type {Cards, DisciplineCard, ChapterCard} from '../layer/data/_types';
import type {SupportedLanguage} from '../translations/_types';

export type CardsService = {|
  find: (token: string, host: string, language: SupportedLanguage) => Promise<Cards>,
  refreshCard: (card: DisciplineCard | ChapterCard) => Promise<DisciplineCard | ChapterCard>,
  getCardFromLocalStorage: (
    levelRef: string,
    language: SupportedLanguage
  ) => Promise<DisciplineCard | ChapterCard>
|};

const service = (dataLayer: DataLayer): CardsService => ({
  find: dataLayer.fetchCards,
  refreshCard: dataLayer.refreshCard,
  getCardFromLocalStorage: dataLayer.getCardFromLocalStorage
});

export default service;
