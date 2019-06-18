// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

const selectAppStoreItem = async () => {
  // to simulate tap on picker item
  await element(by.text('Select an answer'))
    .atIndex(0)
    .tapAtPoint({x: 200, y: 80});
};

describe('Template', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await tapCardOnSection('catalog-section-recommended-items', 6);
  });

  it('should see template elements', async () => {
    await waitForExist('question');
    await weExpect(element(by.id('question-title'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-choices'))).toBeVisible();
    await weExpect(element(by.id('question-template'))).toBeVisible();
    await weExpect(element(by.id('question-part-1'))).toBeVisible();
    await weExpect(element(by.id('question-part-2-text'))).toBeVisible();
    await weExpect(element(by.id('question-part-3'))).toBeVisible();
    await weExpect(element(by.id('question-part-4-select'))).toBeVisible();
    await weExpect(element(by.id('question-part-5'))).toBeVisible();
    await weExpect(element(by.id('button-validate-disabled'))).toBeVisible();
  });

  it('should fill text input', async () => {
    await element(by.id('question-part-2-text')).replaceText('Foobarbaz');
    await weExpect(element(by.id('question-part-2-text-selected'))).toBeVisible();
  });

  it('should open select picker', async () => {
    await element(by.id('ios_touchable_wrapper')).tap();
    await waitForExist('question-part-4-select');
  });

  it('should select item in picker', async () => {
    await selectAppStoreItem();
    await element(by.id('done_button')).tap();
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
      await element(by.id('question-part-2-text')).replaceText('Coorpacademy');
      await element(by.id('question-part-4-select')).tap();
      await selectAppStoreItem();
      await element(by.id('done_button')).tap();
      await element(by.id('button-validate')).tap();
    });

    it('should see a positive correction', async () => {
      await waitForExist('correction-success');
    });
  });
});
