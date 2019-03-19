// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

describe('Header', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-basic-dis-1')).tap();
  });

  it('should see the header elements', async () => {
    await weExpect(element(by.id('header-slide-title'))).toBeVisible();
    await weExpect(element(by.id('header-slide-title-image'))).toBeVisible();
    await weExpect(element(by.id('header-slide-title-title'))).toBeVisible();
  });

  it('should back to home', async () => {
    await element(by.id('header-back')).tap();
    await waitFor(element(by.id('home-screen'))).toBeVisible();
    await weExpect(element(by.id('home-screen'))).toBeVisible();
  });
});
