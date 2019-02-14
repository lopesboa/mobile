// @flow strict

import utils from './utils';

describe('Progression', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('Learner', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
    });

    it('should see a progression', async () => {
      await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
      await weExpect(element(by.id('progression-label'))).toBeVisible();
    });

    it('should see a progression in another tab', async () => {
      await utils.getLessonTab(element).tap();
      await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
      await weExpect(element(by.id('progression-label'))).toBeVisible();
    });
  });

  describe('Microlearning', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await waitFor(element(by.id('catalog-item-basic-cha-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-cha-1')).tap();
    });

    it('should not see a progression', async () => {
      await weExpect(element(by.id('progression-bar'))).toBeNotVisible();
      await weExpect(element(by.id('progression-label'))).toBeNotVisible();
    });
  });
});
