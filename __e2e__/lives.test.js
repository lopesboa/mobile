// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

const wrongAnswer = async () => {
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('question-choice-1')).tap();
  await element(by.id('button-validate')).tap();
};

describe('Lives', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('Learner', () => {
    beforeAll(async () => {
      await waitForExist('catalog-section-recommended-item-basic-dis-1');
      await tapCardOnSection('catalog-section-recommended-items', 2);
    });

    it('should see 3 lives', async () => {
      await weExpect(element(by.id('lives-3'))).toBeVisible();
    });

    it('should lose third life', async () => {
      await wrongAnswer();
      await weExpect(element(by.id('correction-lives-2-broken'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('should see 2 lives', async () => {
      await weExpect(element(by.id('lives-2'))).toBeVisible();
    });
  });

  describe('Adaptive', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnSection('catalog-section-recommended-items', 1);
    });

    it('should not see lives', async () => {
      await weExpect(element(by.id('lives'))).toBeNotVisible();
    });
  });
});
