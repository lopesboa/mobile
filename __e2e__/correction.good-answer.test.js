// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

describe('Correction: good answer', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication(element);
    await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-basic-dis-1')).tap();
    await waitFor(element(by.id('question'))).toBeVisible();
  });

  it('answer successfully', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-2')).tap();
    await element(by.id('button-validate')).tap();
    await element(by.id('button-next-question')).tap();
  });

  it('answer successfully the last question and see correction', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-2')).tap();
    await element(by.id('button-validate')).tap();
    await waitFor(element(by.id('correction-error'))).toBeVisible();
    await weExpect(element(by.id('button-next-question'))).toBeVisible();
  });
});
