// @flow strict

import type {DataLayer} from '../layer/data';
import type {Cards, DisciplineCard, ChapterCard} from '../layer/data/_types';
import type {Section} from '../types';

export type CardsService = {|
  find: (
    token: string,
    host: string,
    section: Section,
    offset: number,
    limit: number
  ) => Promise<{|
    cards: Cards,
    total: number
  |}>,
  refreshCard: (card: DisciplineCard | ChapterCard) => Promise<DisciplineCard | ChapterCard>,
  getCardFromLocalStorage: (levelRef: string) => Promise<DisciplineCard | ChapterCard>
|};

const service = (dataLayer: DataLayer): CardsService => ({
  find: dataLayer.fetchCards,
  refreshCard: dataLayer.refreshCard,
  getCardFromLocalStorage: dataLayer.getCardFromLocalStorage
});

export default service;
