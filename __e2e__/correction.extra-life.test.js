// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

const wrongAnswer = async (el: DetoxElement, {clickOnNext = true}: {clickOnNext: boolean}) => {
  await el(by.id('question-screen')).swipe('up');
  await el(by.id('question-choice-1')).tap();
  await el(by.id('button-validate')).tap();
  await waitFor(el(by.id('correction-error'))).toBeVisible();
  await weExpect(el(by.id('correction-error'))).toBeVisible();

  if (clickOnNext) {
    await el(by.id('button-next-question')).tap();
  }
};

describe('Correction: extra-life', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication(element);
    await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-basic-dis-1')).tap();
    await waitFor(element(by.id('question'))).toBeVisible();
  });

  it('3 wrong answers', async () => {
    await wrongAnswer(element, {clickOnNext: true});
    await wrongAnswer(element, {clickOnNext: true});
    await wrongAnswer(element, {clickOnNext: false});
  });

  it('should offer extralife', async () => {
    await weExpect(element(by.id('extra-life-resource-les_1'))).toBeVisible();
    await weExpect(element(by.id('button-quit'))).toBeVisible();
    await element(by.id('extra-life-resource-les_1')).tap();
    await weExpect(element(by.id('button-next-question'))).toBeVisible();
    await element(by.id('button-next-question')).tap();
  });

  it('a 4th wrong answer', async () => {
    await wrongAnswer(element, {clickOnNext: false});
  });

  afterAll(async () => {
    await element(by.id('button-quit')).tap();
  });
});
