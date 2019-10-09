// @flow strict

import {
  tapCardOnSection,
  waitForExist,
  waitForVisible,
  reloadApp,
  bypassAuthentication
} from './utils';

const answerQuestion = async () => {
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('question-choice-2')).tap();
  await element(by.id('button-validate')).tap();
  await waitForExist('correction-success');
  await element(by.id('button-next-question')).tap();
};

describe('Hero: display card for uncomplete level', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await waitForExist('catalog-section-recommended-item-basic-dis-1');
    await tapCardOnSection('catalog-section-recommended-items', 2);
    await waitForExist('question');
  });

  it('answer successfully 4 questions', async () => {
    await answerQuestion();
    await answerQuestion();
    await answerQuestion();
    await answerQuestion();
  });

  it('should back to home', async () => {
    await element(by.id('header-back')).tap();
    await waitForVisible('home-screen');
  });

  it('should see the hero on dashboard', async () => {
    await waitForVisible('catalog-hero-footer');
    await waitForVisible('catalog-hero-button');
  });

  it('should be redirected to question', async () => {
    await element(by.id('catalog-hero-button')).tap();
    await waitForExist('question');
  });
});
