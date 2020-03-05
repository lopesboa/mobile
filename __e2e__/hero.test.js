// @flow strict

import {
  tapCardOnList,
  waitForExist,
  waitForVisible,
  reloadApp,
  bypassAuthentication
} from './utils';

const answerQuestion = async () => {
  await waitForExist('question-screen');
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
  });

  it('should see the hero on dashboard with recommendation', async () => {
    await waitForVisible('catalog-hero-adaptive-dis-1-footer');
    await waitForVisible('catalog-hero-button');
  });

  it('answer successfully 3 questions', async () => {
    await tapCardOnList('catalog-section-recommended-items', 2);
    await answerQuestion();
    await answerQuestion();
    await answerQuestion();
  });

  it('should back to home', async () => {
    await element(by.id('header-back')).tap();
    await waitForVisible('home-screen');
  });

  it('should see the hero on dashboard', async () => {
    await waitForVisible('catalog-hero-basic-dis-1-footer');
    await waitForVisible('catalog-hero-button');
  });

  it('should be on the context of the course resumed from hero', async () => {
    await element(by.id('catalog-hero-button')).tap();
    await waitForExist('question');
  });
});
