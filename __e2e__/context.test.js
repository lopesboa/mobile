// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

describe('Context', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication(element);
  });

  describe('With image', () => {
    beforeAll(async () => {
      await reloadApp();
      await waitFor(element(by.id('catalog-item-with-image-context-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-with-image-context-dis-1')).tap();
    });

    it('should see elements', async () => {
      await waitFor(element(by.id('context-screen'))).toBeVisible();
      await weExpect(element(by.id('context'))).toBeVisible();
      await weExpect(element(by.id('img-resource'))).toBeVisible();
      await weExpect(element(by.id('button-redirect-question'))).toBeVisible();
    });

    it('should go to the question', async () => {
      await weExpect(element(by.id('button-redirect-question'))).toBeVisible();
      await element(by.id('button-redirect-question')).tap();
      await weExpect(element(by.id('question-screen'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('With video', () => {
    beforeAll(async () => {
      await reloadApp();
      await waitFor(element(by.id('catalog-item-with-video-context-dis-2'))).toBeVisible();
      await element(by.id('catalog-item-with-video-context-dis-2')).tap();
    });

    it('should see elements', async () => {
      await waitFor(element(by.id('context-screen'))).toBeVisible();
      await weExpect(element(by.id('context'))).toBeVisible();
      await waitFor(element(by.id('preview-video-video-resource'))).toBeVisible();
      await weExpect(element(by.id('preview-video-video-resource'))).toBeVisible();
    });

    it('should go to the question', async () => {
      await element(by.id('button-redirect-question')).tap();
      await weExpect(element(by.id('question-screen'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('Without', () => {
    beforeAll(async () => {
      await element(by.id('home-screen')).swipe('down');
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
    });

    it('should not see elements', async () => {
      await weExpect(element(by.id('context-screen'))).toBeNotVisible();
    });
  });
});
