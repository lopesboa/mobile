import {by, element} from 'detox';
import {
  reloadApp,
  bypassAuthentication,
  waitForExist,
  waitForVisible,
  waitForNotVisible,
  tapCardOnList,
  wrongAnswer,
} from './utils';

describe('Level end', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  describe('Failure', () => {
    beforeAll(async () => {
      await tapCardOnList('catalog-section-recommended-items', 2);
      await waitForVisible('header-slide-right');
      // fast slide enabled to have faster scenarios
      await element(by.id('header-slide-right')).longPress();
      await wrongAnswer();
      await waitForVisible('correction-error');
      await element(by.id('button-quit')).tap();
    });

    it('should see error level end elements', async () => {
      await waitForVisible('level-end-error');
      await waitForVisible('level-end-header');
      await waitForVisible('level-end-subtitle');
      await waitForVisible('level-end-button-close');
      await waitForNotVisible('level-end-highscore');
      await waitForNotVisible('level-end-unlock');
      await waitForVisible('button-retry-level');
      await element(by.id('level-end-screen')).swipe('up');
      await waitForVisible('recommend-item');
      // @todo uncomment this once we got real recommendations
      // await waitForVisible('recommend-item-adaptive-dis-1');
    });

    it('should be able to retry', async () => {
      await element(by.id('button-retry-level')).tap();
      await waitForNotVisible('level-end-success');
      await waitForNotVisible('level-end-error');
      await waitForExist('question');
    });

    it('should be able to back to home', async () => {
      await wrongAnswer();
      await waitForVisible('correction-error');
      await element(by.id('button-quit')).tap();
      await element(by.id('level-end-button-close')).tap();
      await waitForVisible('home');
    });

    // @todo uncomment this once we got real recommendations

    // it('should be able to follow recommendation', async () => {
    //   await wrongAnswer();
    //   await waitForVisible('correction-error');
    //   await element(by.id('button-quit')).tap();
    //   await element(by.id('recommend-item-adaptive-dis-1')).tap();
    //   await waitForNotVisible('level-end-success');
    //   await waitForNotVisible('level-end-error');
    //   await waitForExist('question');
    // });
  });

  describe('Success', () => {
    beforeAll(async () => {
      await tapCardOnList('catalog-section-recommended-items', 2);
      await waitForVisible('header-slide-right-fast-slide');
      // god mode enabled to have success level end
      await element(by.id('header-slide-right-fast-slide')).tap();
      await wrongAnswer();
      await waitForVisible('correction-success');
      await element(by.id('button-next-question')).tap();
    });

    it('should see success level end elements', async () => {
      await waitForVisible('level-end-success');
      await waitForVisible('level-end-header');
      await waitForNotVisible('level-end-subtitle');
      await waitForVisible('level-end-button-close');
      await waitForVisible('level-end-highscore');
      await waitForVisible('level-end-unlock');
      await waitForVisible('button-next-level');
      await element(by.id('level-end-screen')).swipe('up');
      await waitForVisible('recommend-item');
      // @todo uncomment this once we got real recommendations
      // await waitForVisible('recommend-item-adaptive-dis-1');
    });

    it('should be able to back to home', async () => {
      await element(by.id('level-end-button-close')).tap();
      await waitForVisible('home');
    });

    it('should not see the highscore if not higher than before', async () => {
      await tapCardOnList('catalog-section-recommended-items', 2);
      await wrongAnswer();
      await waitForVisible('correction-success');
      await element(by.id('button-next-question')).tap();
      await waitForNotVisible('level-end-highscore');
    });

    it('should be able to reach the next level', async () => {
      await element(by.id('button-next-level')).tap();
      await waitForNotVisible('level-end-success');
      await waitForNotVisible('level-end-error');
      await waitForExist('question');
    });

    // @todo uncomment this once we got real recommendations

    // it('should be able to follow recommendation', async () => {
    //   await wrongAnswer();
    //   await waitForVisible('correction-success');
    //   await element(by.id('button-next-question')).tap();
    //   await waitForNotVisible('level-end-highscore');
    //   await element(by.id('recommend-item-adaptive-dis-1')).tap();
    //   await waitForNotVisible('level-end-success');
    //   await waitForNotVisible('level-end-error');
    //   await waitForExist('question');
    // });
  });
});
