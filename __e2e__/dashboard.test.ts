import {
  waitForExist,
  waitForNotVisible,
  reloadApp,
  bypassAuthentication,
  tapCardOnList,
  scrollHero,
} from './utils';

describe('Dashboard', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await scrollHero();
  });

  describe('Sections', () => {
    it('should see the sections on dashboard', async () => {
      await waitForExist('catalog-section-recommended-items');
      await waitForExist('catalog-section-most-popular-items');
    });

    it('should fetch cards', async () => {
      await waitForExist('catalog-section-recommended-items-item-adaptive-dis-1');
      await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    });

    it('should prepare more placeholders for the next cards', async () => {
      await waitForExist('catalog-section-recommended-items-item-6-placeholder');
      await waitForExist('catalog-section-recommended-items-item-9-placeholder');
    });
  });

  describe('Locked card', () => {
    it('should not be able to press on locked card', async () => {
      await tapCardOnList('catalog-section-recommended-items', 11);
      await waitForNotVisible('question-screen');
    });
  });
});
