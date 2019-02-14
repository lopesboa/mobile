// @flow strict

import utils from './utils';

const wrongAnswer = async () => {
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('question-choice-1')).tap();
  await element(by.id('button-validate')).tap();
};

describe('Lives', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('Learner', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
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

    it('should lose second life', async () => {
      await wrongAnswer();
      await weExpect(element(by.id('correction-lives-1-broken'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('should see 1 life', async () => {
      await weExpect(element(by.id('lives-1'))).toBeVisible();
    });

    it('should lose last life', async () => {
      await wrongAnswer();
      await weExpect(element(by.id('correction-lives-0-broken'))).toBeVisible();
    });

    it('should see a button to continue', async () => {
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('button-next'))).toBeVisible();
    });

    it('should navigate to level end', async () => {
      await element(by.id('button-next')).tap();
      await waitFor(element(by.id('level-end-error'))).toBeVisible();
      await weExpect(element(by.id('level-end-error'))).toBeVisible();
    });

    it('should see elements', async () => {
      await weExpect(element(by.id('level-end-title'))).toBeVisible();
      await weExpect(element(by.id('level-end-subtitle'))).toBeVisible();
      await weExpect(element(by.id('button-retry-level'))).toBeVisible();
    });

    it('should back to home', async () => {
      await element(by.id('button-retry-level')).tap();
      await waitFor(element(by.id('home'))).toBeVisible();
      await weExpect(element(by.id('home'))).toBeVisible();
    });
  });

  describe('Microlearning', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-cha-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-cha-1')).tap();
    });

    it('should see 1 life', async () => {
      await weExpect(element(by.id('lives-1'))).toBeVisible();
    });

    it('should lose life', async () => {
      await wrongAnswer();
      await weExpect(element(by.id('correction-lives-0-broken'))).toBeVisible();
    });

    it('should see a button to continue', async () => {
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('button-next'))).toBeVisible();
    });

    it('should navigate to level end', async () => {
      await element(by.id('button-next')).tap();
      await waitFor(element(by.id('level-end-error'))).toBeVisible();
      await weExpect(element(by.id('level-end-error'))).toBeVisible();
    });

    it('should see elements', async () => {
      await weExpect(element(by.id('level-end-title'))).toBeVisible();
      await weExpect(element(by.id('level-end-subtitle'))).toBeVisible();
      await weExpect(element(by.id('button-retry-level'))).toBeVisible();
    });

    it('should back to home', async () => {
      await element(by.id('button-retry-level')).tap();
      await waitFor(element(by.id('home'))).toBeVisible();
      await weExpect(element(by.id('home'))).toBeVisible();
    });
  });

  describe('Adaptive', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-adaptive-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-adaptive-dis-1')).tap();
    });

    it('should not see lives', async () => {
      await weExpect(element(by.id('lives'))).toBeNotVisible();
    });

    it('should see a button to continue', async () => {
      await wrongAnswer();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('button-next-question'))).toBeVisible();
    });

    it('should back to the question', async () => {
      await element(by.id('button-next-question')).tap();
      await waitFor(element(by.id('question'))).toBeVisible();
      await weExpect(element(by.id('question'))).toBeVisible();
    });
  });
});
