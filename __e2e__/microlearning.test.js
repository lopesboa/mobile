// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

describe('Microlearning', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should open chapter', async () => {
    await element(by.id('home-screen')).swipe('up');
    await tapCardOnSection('catalog-section-recommended-items', 11);
  });

  it('should see 1 life', async () => {
    await weExpect(element(by.id('lives-1'))).toBeVisible();
  });

  it('should see QCM elements', async () => {
    await waitForExist('question');
    await weExpect(element(by.id('question-title'))).toBeVisible();
  });

  it('should be able to answer', async () => {
    await element(by.id('question-choice-1')).tap();
    await weExpect(element(by.id('question-choice-1-selected'))).toBeVisible();
    await element(by.id('question-screen')).swipe('up');
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });
});
