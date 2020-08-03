import {by, expect, element} from 'detox';
import {
  reloadApp,
  bypassAuthentication,
  bypassNotifyMeScreen,
  tap,
  tapCardOnList,
  waitForExist,
} from './utils';

describe('Context', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await bypassNotifyMeScreen();
  });

  describe('With image', () => {
    beforeAll(async () => {
      await reloadApp();
      await tapCardOnList('catalog-section-recommended-items', 3);
    });

    it('should see elements', async () => {
      await waitForExist('context-screen');
      await expect(element(by.id('context'))).toBeVisible();
      await expect(
        element(by.type('RCTImageView').and(by.id('context-resource-img'))),
      ).toBeVisible();
      await expect(element(by.id('button-redirect-question'))).toBeVisible();
    });

    it('should go to the question', async () => {
      await expect(element(by.id('button-redirect-question'))).toBeVisible();
      await element(by.id('button-redirect-question')).tap();
      await expect(element(by.id('question-screen'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('With video', () => {
    beforeAll(async () => {
      await reloadApp();
      await tapCardOnList('catalog-section-recommended-items', 4);
    });

    it('should see elements', async () => {
      await waitForExist('context-screen');
      await expect(element(by.id('context'))).toBeVisible();
      await expect(
        element(by.type('RCTView').and(by.id('context-resource-video-preview-video'))),
      ).toBeVisible();
    });

    it('should go to the question', async () => {
      await tap('button-redirect-question');
      await waitForExist('question-screen');
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('Without', () => {
    beforeAll(async () => {
      await tapCardOnList('catalog-section-recommended-items', 2);
    });

    it('should not see elements', async () => {
      await expect(element(by.id('context-screen'))).toBeNotVisible();
    });
  });
});
