// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  tapCardOnList,
  waitForExist,
  waitForNotVisible
} from './utils';

describe('Template', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await tapCardOnList('catalog-section-recommended-items', 7);
  });

  it('should see template elements', async () => {
    await waitForExist('question');
    await weExpect(element(by.id('question-title'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-choices'))).toBeVisible();
    await weExpect(element(by.id('question-template'))).toBeVisible();
    await weExpect(element(by.id('question-section-1-part-1'))).toBeVisible();
    await weExpect(element(by.id('question-section-1-part-2-text'))).toBeVisible();
    await weExpect(element(by.id('question-section-1-part-3'))).toBeVisible();
    await weExpect(element(by.id('question-section-1-part-4'))).toBeVisible();
    await weExpect(element(by.id('question-section-1-part-4-select-input'))).toBeVisible();
    await weExpect(element(by.id('button-validate-disabled'))).toBeVisible();
  });

  it('should fill text input', async () => {
    await element(by.id('question-section-1-part-2-text')).replaceText('Foobarbaz');
    await weExpect(element(by.id('question-section-1-part-2-text-selected'))).toBeVisible();
  });

  it('should open modal', async () => {
    await element(by.id('question-section-1-part-4-select-input')).tap();
    await waitForExist('question-section-1-part-4-select-modal-animated');
  });

  it('should select item in picker', async () => {
    await element(by.id('question-section-1-part-4-select-modal-item-1')).tap();
    await waitForNotVisible('question-section-1-part-4-select-modal-animated');
  });

  it('should be able to validate', async () => {
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });

  describe('Negative correction', () => {
    beforeAll(async () => {
      await element(by.id('button-validate')).tap();
    });

    it('should see a negative correction', async () => {
      await waitForExist('correction-error');
    });

    afterAll(async () => {
      await element(by.id('button-next-question')).tap();
    });
  });

  describe('Positive correction', () => {
    beforeAll(async () => {
      await element(by.id('question-section-1-part-2-text')).replaceText('Coorpacademy');
      await element(by.id('question-section-1-part-4-select-input')).tap();
      await waitForExist('question-section-1-part-4-select-modal-animated');
      await element(by.id('question-section-1-part-4-select-modal-item-2')).tap();
      await waitForNotVisible('question-section-1-part-4-select-modal-animated');
      await element(by.id('button-validate')).tap();
    });

    it('should see a positive correction', async () => {
      await waitForExist('correction-success');
    });
  });
});
