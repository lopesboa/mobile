// @flow strict

import utils from './utils';

describe('Context', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('With image', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-with-image-context-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-with-image-context-dis-1')).tap();
    });

    it('should see elements', async () => {
      await waitFor(element(by.id('context-screen'))).toBeVisible();
      await weExpect(element(by.id('context'))).toBeVisible();
      await weExpect(element(by.id('context-image'))).toBeVisible();
      await weExpect(element(by.id('goToQuestion-button'))).toBeVisible();
    });

    it('should go to the question', async () => {
      await element(by.id('goToQuestion-button')).tap();
      await weExpect(element(by.id('question-screen'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('With video', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-with-video-context-dis-2'))).toBeVisible();
      await element(by.id('catalog-item-with-video-context-dis-2')).tap();
    });

    it('should see elements', async () => {
      await waitFor(element(by.id('context-screen'))).toBeVisible();
      await weExpect(element(by.id('context'))).toBeVisible();
      await waitFor(element(by.id('preview-video'))).toBeVisible();
      await weExpect(element(by.id('preview-video'))).toBeVisible();
    });

    it('should go to the question', async () => {
      await element(by.id('goToQuestion-button')).tap();
      await weExpect(element(by.id('question-screen'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('header-back')).tap();
    });
  });

  describe('Without', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
    });

    it('should not see elements', async () => {
      await weExpect(element(by.id('context-screen'))).toBeNotVisible();
    });
  });
});
