// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  waitForVisible,
  waitForExist,
  waitForNotVisible,
  tapCardOnList
} from './utils';

const thirdCard = 'catalog-search-items-item-with-image-context-dis-1';
const fourthCard = 'catalog-search-items-item-with-video-context-dis-2';

const openSearch = async () => {
  await waitForVisible('search-icon');
  await element(by.id('search-icon')).tap();
  await waitForExist('search-input-field');
};

const makeSearch = async () => {
  await element(by.id('search-input-field')).typeText('ia');
  await waitForExist(thirdCard);
  await waitForExist(fourthCard);
};

describe('CatalogSearch', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should be redirected to search', async () => {
    await openSearch();
  });

  it('should be able to fill in the search input', async () => {
    await makeSearch();
  });

  it('should be able to select a card', async () => {
    await tapCardOnList('catalog-search-items', 4, true);
    await weExpect(element(by.id('header-slide-title'))).toBeVisible();
  });

  it('should be able to back to search', async () => {
    await element(by.id('header-back')).tap();
  });

  describe('Clear', () => {
    beforeEach(async () => {
      await makeSearch();
    });

    it('should be able to clear the results with a button', async () => {
      await waitForVisible('search-input-clear');
      await element(by.id('search-input-clear')).tap();
    });

    it('should clear the results when search is empty', async () => {
      await element(by.id('search-input-field')).clearText();
    });

    it('should clear the results at back', async () => {
      await element(by.id('search-back-icon')).tap();
      await openSearch();
    });

    afterEach(async () => {
      await waitForNotVisible(thirdCard);
      await waitForNotVisible(fourthCard);
    });
  });
});
