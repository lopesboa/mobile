import {by, expect, element} from 'detox';
import {
  reloadApp,
  bypassAuthentication,
  bypassNotifyMeScreen,
  tapCardOnList,
  waitForExist,
  waitForVisible,
} from './utils';

describe('Header', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await bypassNotifyMeScreen();
  });

  it('should see catalog and choose a discipline', async () => {
    await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    await tapCardOnList('catalog-section-recommended-items', 2);
  });

  it('should see the header elements', async () => {
    await expect(element(by.id('header-slide-title'))).toBeVisible();
    await expect(element(by.id('header-slide-title-image'))).toBeVisible();
    await expect(element(by.id('header-slide-title-title'))).toBeVisible();
  });

  it('should back to home', async () => {
    await element(by.id('question-header-back')).tap();
    await waitForVisible('home-screen');
  });
});
