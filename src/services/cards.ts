import type {DataLayer} from '../layer/data';

export type CardsService = {
  findBySection: Pick<DataLayer, 'fetchSectionCards'>;
  findBySearch: Pick<DataLayer, 'fetchSearchCards'>;
  refreshCard: Pick<DataLayer, 'refreshCard'>;
  getCardFromLocalStorage: Pick<DataLayer, 'getCardFromLocalStorage'>;
};

const service = (dataLayer: DataLayer): CardsService => ({
  findBySection: dataLayer.fetchSectionCards,
  findBySearch: dataLayer.fetchSearchCards,
  refreshCard: dataLayer.refreshCard,
  getCardFromLocalStorage: dataLayer.getCardFromLocalStorage,
});

export default service;
