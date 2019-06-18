// @flow strict

import {
  reloadApp,
  bypassAuthentication,
  getLessonTab,
  tapCardOnSection,
  waitForExist
} from './utils';

describe('Progression bar', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should open a question see a progression bar', async () => {
    await waitForExist('catalog-section-recommended-item-basic-dis-1');
    await tapCardOnSection('catalog-section-recommended-items', 2);
    await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
    await weExpect(element(by.id('progression-label'))).toBeVisible();
  });

  it('should see a progression bar in another tab', async () => {
    await getLessonTab(element).tap();
    await weExpect(element(by.id('progression-bar-1'))).toBeVisible();
    await weExpect(element(by.id('progression-label'))).toBeVisible();
  });
});
