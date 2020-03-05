// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  tapCardOnList,
  waitForExist,
  waitForVisible
} from './utils';

describe('Header', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    await tapCardOnList('catalog-section-recommended-items', 2);
  });

  it('should see the header elements', async () => {
    await weExpect(element(by.id('header-slide-title'))).toBeVisible();
    await weExpect(element(by.id('header-slide-title-image'))).toBeVisible();
    await weExpect(element(by.id('header-slide-title-title'))).toBeVisible();
  });

  it('should back to home', async () => {
    await element(by.id('header-back')).tap();
    await waitForVisible('home-screen');
  });
});
