import {by, expect, element} from 'detox';
// import {sleep} from '../src/utils/tests';
import {
  reloadApp,
  bypassAuthentication,
  bypassNotifyMeScreen,
  getClueTab,
  tapCardOnList,
  waitForExist,
} from './utils';

describe('Clue', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await bypassNotifyMeScreen();
  });

  describe('With clue', () => {
    it('should open the player', async () => {
      await tapCardOnList('catalog-section-recommended-items', 2);
    });

    it('should be able to open the clue tab', async () => {
      await getClueTab(element).tap();
      await waitForExist('clue');
      await expect(element(by.id('clue-advice'))).toBeVisible();
      await expect(element(by.id('button-clue'))).toBeVisible();
    });

    // Buggy, should see later
    // it('should be able to reveal the clue', async () => {
    //   await element(by.id('button-clue')).tap();
    //   await sleep(1000);
    //   await expect(element(by.id('clue-advice'))).toBeNotVisible();
    //   await expect(element(by.id('button-clue'))).toBeNotVisible();
    //   await expect(element(by.id('clue-back'))).toBeVisible();
    // });
  });

  describe('Without clue', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await tapCardOnList('catalog-section-recommended-items', 6);
    });

    it('should not be able to open the clue tab', async () => {
      await getClueTab(element).tap();
      await expect(element(by.id('clue'))).toBeNotVisible();
    });
  });
});
