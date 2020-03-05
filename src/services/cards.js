// @flow strict

import type {DataLayer} from '../layer/data';

export type CardsService = {|
  findBySection: $PropertyType<DataLayer, 'fetchSectionCards'>,
  findBySearch: $PropertyType<DataLayer, 'fetchSearchCards'>,
  refreshCard: $PropertyType<DataLayer, 'refreshCard'>,
  getCardFromLocalStorage: $PropertyType<DataLayer, 'getCardFromLocalStorage'>
|};

const service = (dataLayer: DataLayer): CardsService => ({
  findBySection: dataLayer.fetchSectionCards,
  findBySearch: dataLayer.fetchSearchCards,
  refreshCard: dataLayer.refreshCard,
  getCardFromLocalStorage: dataLayer.getCardFromLocalStorage
});

export default service;
