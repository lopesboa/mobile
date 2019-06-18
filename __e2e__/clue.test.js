// @flow strict

// import {sleep} from '../src/utils/tests';
import {reloadApp, bypassAuthentication, getClueTab, tapCardOnSection, waitForExist} from './utils';

describe('Clue', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('With clue', () => {
    it('should open the player', async () => {
      await tapCardOnSection('catalog-section-recommended-items', 2);
    });

    it('should be able to open the clue tab', async () => {
      await getClueTab(element).tap();
      await waitForExist('clue');
      await weExpect(element(by.id('clue-advice'))).toBeVisible();
      await weExpect(element(by.id('button-clue'))).toBeVisible();
    });

    // Buggy, should see later
    // it('should be able to reveal the clue', async () => {
    //   await element(by.id('button-clue')).tap();
    //   await sleep(1000);
    //   await weExpect(element(by.id('clue-advice'))).toBeNotVisible();
    //   await weExpect(element(by.id('button-clue'))).toBeNotVisible();
    //   await weExpect(element(by.id('clue-back'))).toBeVisible();
    // });
  });

  describe('Without clue', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnSection('catalog-section-recommended-items', 5);
    });

    it('should not be able to open the clue tab', async () => {
      await getClueTab(element).tap();
      await weExpect(element(by.id('clue'))).toBeNotVisible();
    });
  });
});
