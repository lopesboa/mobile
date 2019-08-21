// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  getLessonTab,
  tapCardOnSection,
  waitForExist,
  waitForVisible
  // waitForNotVisible
} from './utils';

describe('Lesson', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('More than 1 resource', () => {
    it('should see catalog and choose a discipline', async () => {
      await waitForExist('catalog-section-recommended-item-basic-dis-1');
      await tapCardOnSection('catalog-section-recommended-items', 2);
    });

    // it('should see lesson tab icon with notification', async () => {
    //   await weExpect(element(by.id('lesson-notification'))).toBeVisible();
    // });

    it('should be redirected to lesson tab', async () => {
      await getLessonTab(element).tap();
      await waitForVisible('lesson-screen');
    });

    it('should see resources browser', async () => {
      await weExpect(element(by.id('resources-browser'))).toExist();
    });

    it('should see a stars note', async () => {
      await weExpect(element(by.id('additional-stars-note'))).toBeVisible();
    });

    it('should see the first resource selected', async () => {
      await weExpect(element(by.id('resource-les-1-selected'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-thumbnail'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-thumbnail-preview-container'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-description'))).toBeVisible();
      await weExpect(element(by.id('lesson-resource-preview-video'))).toBeVisible();
    });
  });

  describe('Browser', () => {
    it('should scroll to pdf resource', async () => {
      await element(by.id('resources')).swipe('up');
      await weExpect(element(by.id('resource-les-4'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-thumbnail'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-thumbnail-preview-container'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-description'))).toBeVisible();
    });

    it('should be able to select the pdf resource', async () => {
      await element(by.id('resource-les-4')).tap();
      await weExpect(element(by.id('resource-les-4-selected'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-thumbnail'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-thumbnail-preview-container'))).toBeVisible();
      await weExpect(element(by.id('resource-les-4-description'))).toBeVisible();
      await weExpect(element(by.id('lesson-resource-preview-pdf'))).toBeVisible();
    });
  });

  describe('1 resource only', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnSection('catalog-section-recommended-items', 1);
      await getLessonTab(element).tap();
    });

    it('should be redirected to lesson tab', async () => {
      await getLessonTab(element).tap();
      await waitForVisible('lesson-screen');
    });

    it('should not see resources browser', async () => {
      await weExpect(element(by.id('resources-browser'))).toBeNotVisible();
    });
  });

  describe('Without resource', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnSection('catalog-section-recommended-items', 5);
    });

    it('should not be redirected to lesson tab', async () => {
      await getLessonTab(element).tap();
      await weExpect(element(by.id('lesson-screen'))).toBeNotVisible();
    });
  });
});
