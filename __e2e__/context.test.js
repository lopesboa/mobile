// @flow strict

import {reloadApp, bypassAuthentication, tap, tapCardOnSection, waitForExist} from './utils';

describe('Context', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('With image', () => {
    beforeAll(async () => {
      await reloadApp();
      await tapCardOnSection('catalog-section-recommended-items', 3);
    });

    it('should see elements', async () => {
      await waitForExist('context-screen');
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
      await tapCardOnSection('catalog-section-recommended-items', 4);
    });

    it('should see elements', async () => {
      await waitForExist('context-screen');
      await weExpect(element(by.id('context'))).toBeVisible();
      await waitForExist('preview-video-video-resource');
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
      await tapCardOnSection('catalog-section-recommended-items', 2);
    });

    it('should not see elements', async () => {
      await weExpect(element(by.id('context-screen'))).toBeNotVisible();
    });
  });
});
