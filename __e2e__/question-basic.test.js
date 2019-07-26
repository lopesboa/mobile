// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

describe('Basic Question', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await tapCardOnSection('catalog-section-recommended-items', 10);
  });

  it('should see the question elements', async () => {
    await waitForExist('question');
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
      await waitForExist('correction-error');
    });
  });

  describe('Positive correction', () => {
    beforeAll(async () => {
      await element(by.id('button-next-question')).tap();
    });
    it('should see the positve correction screen', async () => {
      await element(by.id('question-input-text')).replaceText('Play Store');
      await element(by.id('button-validate')).tap();
      await waitForExist('correction-success');
    });
  });
});
