// @flow strict

import utils from './utils';

describe('Dashboard', () => {
  beforeAll(async () => {
    await utils.reloadApp();
    await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
  });

  it('Should be able to see brand logo on the top of the screen', async () => {
    await waitFor(element(by.id('brand-logo'))).toBeVisible();
    await weExpect(element(by.id('brand-logo'))).toBeVisible();
  });

  describe('Cards', () => {
    it('Should be able to see the cover card', async () => {
      await waitFor(element(by.id('catalog-item-adaptive-dis-1'))).toBeVisible();
      await weExpect(element(by.id('catalog-item-adaptive-dis-1'))).toBeVisible();
    });
    it('Should be able to see see other cards', async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await weExpect(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await weExpect(
        element(by.id('gradient-catalog-item-with-image-context-dis-1'))
      ).toBeVisible();
    });
  });
});
