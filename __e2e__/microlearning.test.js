// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

describe('Microlearning', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication(element);
  });

  it('should open chapter', async () => {
    await element(by.id('home-screen')).swipe('up');
    await waitFor(element(by.id('catalog-item-microlearning-basic-cha-1'))).toBeVisible();
    await element(by.id('catalog-item-microlearning-basic-cha-1')).tap();
  });

  it('should see 1 life', async () => {
    await weExpect(element(by.id('lives-1'))).toBeVisible();
  });

  it('should see QCM elements', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
    await weExpect(element(by.id('question-title'))).toBeVisible();
  });

  it('should be able to answer', async () => {
    await element(by.id('question-choice-1')).tap();
    await weExpect(element(by.id('question-choice-1-selected'))).toBeVisible();
    await element(by.id('question-screen')).swipe('up');
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });

  afterAll(async () => {
    await element(by.id('header-back')).tap();
  });
});
