// @flow strict

import utils from './utils';

describe('Basic Question', () => {
  beforeAll(async () => {
    await utils.reloadApp();
    await element(by.id('home-screen')).swipe('up');
    await waitFor(element(by.id('catalog-item-question-basic-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-question-basic-dis-1')).tap();
  });

  it('should see the question elements', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
    await weExpect(element(by.id('question-title'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-input-text'))).toBeVisible();
  });

  it('should fill text input', async () => {
    await element(by.id('question-input-text')).replaceText(
      'Coucou toi qui essaie de debugger les tests e2e'
    );
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });

  describe('Negative correction', () => {
    it('should see the negative correction screen', async () => {
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('correction-error'))).toBeVisible();
    });
  });

  describe('Positive correction', () => {
    beforeAll(async () => {
      await element(by.id('button-next-question')).tap();
    });
    it('should see the positve correction screen', async () => {
      await element(by.id('question-input-text')).replaceText('Play Store');
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await weExpect(element(by.id('correction-success'))).toBeVisible();
    });
  });
});
