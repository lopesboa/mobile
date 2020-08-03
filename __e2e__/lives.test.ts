import {by, expect, element} from 'detox';
import {
  reloadApp,
  bypassAuthentication,
  bypassNotifyMeScreen,
  tapCardOnList,
  waitForExist,
  wrongAnswer,
  scrollHero,
} from './utils';

describe('Lives', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await bypassNotifyMeScreen();
    await scrollHero();
  });

  describe('Learner', () => {
    beforeAll(async () => {
      await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
      await tapCardOnList('catalog-section-recommended-items', 2);
    });

    it('should see 4 lives', async () => {
      await expect(element(by.id('lives-4'))).toBeVisible();
    });

    it('should lose fourth life', async () => {
      await wrongAnswer();
      await expect(element(by.id('correction-lives-3-broken'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('should see 3 lives', async () => {
      await expect(element(by.id('lives-3'))).toBeVisible();
    });
  });

  describe('Adaptive', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnList('catalog-section-recommended-items', 1);
    });

    it('should not see lives', async () => {
      await expect(element(by.id('lives'))).toBeNotVisible();
    });
  });

  describe('Microlearning', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await element(by.id('home-screen')).swipe('up');
      await tapCardOnList('catalog-section-recommended-items', 12);
    });

    it('should not see lives', async () => {
      await expect(element(by.id('lives'))).toBeNotVisible();
    });
  });
});
