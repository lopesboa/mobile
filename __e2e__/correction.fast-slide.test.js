// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  waitForVisible,
  waitForNotVisible,
  waitForExist,
  tapCardOnList
} from './utils';

describe('Correction: fast slide', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await tapCardOnList('catalog-section-recommended-items', 2);
  });

  it('should be able to enable fast slide', async () => {
    await waitForVisible('header-slide-right');
    await element(by.id('header-slide-right')).longPress();
    await waitForVisible('header-slide-right-fast-slide');
  });

  it('should answer wrongly and access to level end directly', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-3')).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-error');
    await element(by.id('button-quit')).tap();
    await waitForVisible('level-end-error');
  });

  it('should be able to disable fast slide', async () => {
    await element(by.id('button-retry-level')).tap();
    await waitForVisible('header-slide-right-fast-slide');
    await element(by.id('header-slide-right-fast-slide')).longPress();
    await waitForVisible('header-slide-right');
  });

  it('should answer wrongly and not access to level end', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-3')).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-error');
    await element(by.id('button-next-question')).tap();
    await waitForNotVisible('level-end-success');
    await waitForNotVisible('level-end-error');
    await waitForExist('question');
  });
});
