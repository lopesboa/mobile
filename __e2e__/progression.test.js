// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  getLessonTab,
  getQuestionTab,
  tapCardOnSection,
  waitForExist,
  wrongAnswer,
  scrollHero
} from './utils';

describe('Progression bar', () => {
  beforeAll(async () => {
    await reloadApp({}, true);
    await bypassAuthentication();
    await scrollHero();
  });

  it('should open a question see a progression bar', async () => {
    await waitForExist('catalog-section-recommended-item-basic-dis-1');
    await tapCardOnSection('catalog-section-recommended-items', 2);
    await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
    await weExpect(element(by.id('progression-label'))).toBeVisible();
  });

  it('should see a progression bar in another tab', async () => {
    await getLessonTab(element).tap();
    await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
    await weExpect(element(by.id('progression-label'))).toBeVisible();
  });

  it('should see progress bar updated after answering a question and then go to catalog', async () => {
    await getQuestionTab(element).tap();
    await wrongAnswer();
    await weExpect(element(by.id('correction-lives-3-broken'))).toBeVisible();
    await element(by.id('button-next-question')).tap();
    await element(by.id('header-back')).tap();
    await weExpect(
      element(
        by
          .type('RCTView')
          .and(by.id('progression-bar-0.041666666666666664'))
          .withAncestor(by.id('catalog-section-recommended-item-basic-dis-1'))
      )
    ).toBeVisible();
  });

  describe('Persistency', () => {
    beforeAll(async () => {
      await reloadApp();
      await scrollHero();
    });

    it('should save progress bar to its state before reloading the app', async () => {
      await weExpect(
        element(
          by
            .type('RCTView')
            .and(by.id('progression-bar-0.041666666666666664'))
            .withAncestor(by.id('catalog-section-recommended-item-basic-dis-1'))
        )
      ).toBeVisible();
    });
  });
});
