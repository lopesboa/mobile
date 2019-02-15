// @flow strict

// import {sleep} from '../src/utils/tests';
import utils from './utils';

describe('Clue', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('With clue', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
    });

    it('should be able to open the clue tab', async () => {
      await utils.getClueTab(element).tap();
      await waitFor(element(by.id('clue'))).toBeVisible();
      await weExpect(element(by.id('clue'))).toBeVisible();
      await weExpect(element(by.id('clue-advice'))).toBeVisible();
      await weExpect(element(by.id('clue-button'))).toBeVisible();
    });

    // Buggy, should see later
    // it('should be able to reveal the clue', async () => {
    //   await element(by.id('clue-button')).tap();
    //   await sleep(1000);
    //   await weExpect(element(by.id('clue-advice'))).toBeNotVisible();
    //   await weExpect(element(by.id('clue-button'))).toBeNotVisible();
    //   await weExpect(element(by.id('clue-back'))).toBeVisible();
    // });
  });

  describe('Without clue', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await waitFor(element(by.id('catalog-item-no-clue-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-no-clue-dis-1')).tap();
    });

    it('should not be able to open the clue tab', async () => {
      await utils.getClueTab(element).tap();
      await weExpect(element(by.id('clue'))).toBeNotVisible();
    });
  });
});
