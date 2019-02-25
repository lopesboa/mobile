// @flow strict

// import {sleep} from '../src/utils/tests';
import utils from './utils';

describe('Context', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('With context', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-with-context-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-with-context-dis-1')).tap();
    });

    it('should be able to consume the context and go to question', async () => {
      await waitFor(element(by.id('context-screen'))).toBeVisible();
      await weExpect(element(by.id('context'))).toBeVisible();
      await weExpect(element(by.id('goToQuestion-button'))).toBeVisible();
      await element(by.id('goToQuestion-button')).tap();
    });

    it('should be able to answer', async () => {
      await element(by.id('question-choice-1')).tap();
      await weExpect(element(by.id('question-choice-1-selected'))).toBeVisible();
      await element(by.id('question-screen')).swipe('up');
      await weExpect(element(by.id('button-validate'))).toBeVisible();
    });
  });
});
