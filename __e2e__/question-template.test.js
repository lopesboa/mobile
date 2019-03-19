// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

const selectAppStoreItem = async el => {
  // to simulate tap on picker item
  await el(by.text('Select an answer'))
    .atIndex(0)
    .tapAtPoint({x: 200, y: 80});
};

describe('Template', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await element(by.id('home-screen')).swipe('up');
    await waitFor(element(by.id('catalog-item-template-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-template-dis-1')).tap();
  });

  it('should see template elements', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
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
    await waitFor(element(by.id('question-part-4-select'))).toBeVisible();
    await weExpect(element(by.id('question-part-4-select'))).toBeVisible();
  });

  it('should select item in picker', async () => {
    await selectAppStoreItem(element);
    await element(by.id('done_button')).tap();
    await waitFor(element(by.id('question-part-4-select-selected'))).toBeVisible();
    await weExpect(element(by.id('question-part-4-select-selected'))).toBeVisible();
  });

  it('should be able to validate', async () => {
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });

  describe('Negative correction', () => {
    beforeAll(async () => {
      await element(by.id('button-validate')).tap();
    });

    it('should see a negative correction', async () => {
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('correction-error'))).toBeVisible();
    });

    afterAll(async () => {
      await element(by.id('button-next-question')).tap();
    });
  });

  describe('Positive correction', () => {
    beforeAll(async () => {
      await element(by.id('question-part-2-text')).replaceText('Coorpacademy');
      await element(by.id('question-part-4-select')).tap();
      await selectAppStoreItem(element);
      await element(by.id('done_button')).tap();
      await element(by.id('button-validate')).tap();
    });

    it('should see a positive correction', async () => {
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await weExpect(element(by.id('correction-success'))).toBeVisible();
    });
  });
});
