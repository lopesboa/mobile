// @flow strict

import {waitForExist, waitForVisible, reloadApp, bypassAuthentication} from './utils';

describe('Dashboard', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('Sections', () => {
    it('should see the sections on dashboard', async () => {
      await waitForExist('catalog-section-recommended-items');
      await waitForExist('catalog-section-most-popular-items');
    });

    it('should fetch cards', async () => {
      await waitForExist('catalog-section-recommended-item-adaptive-dis-1');
      await waitForExist('catalog-section-recommended-item-basic-dis-1');
    });

    it('should prepare more placeholders for the next cards', async () => {
      await waitForExist('catalog-section-recommended-item-6-placeholder');
      await waitForExist('catalog-section-recommended-item-9-placeholder');
    });
  });

  describe('Hero', () => {
    it('should see the hero on dashboard', async () => {
      await waitForVisible('catalog-hero-footer');
      await waitForVisible('catalog-hero-button');
    });

    it('should be redirected to question', async () => {
      await element(by.id('catalog-hero-button')).tap();
      await waitForExist('question');
    });
  });
});
