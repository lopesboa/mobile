import {reloadApp, bypassAuthentication, waitForVisible, tapCardOnList} from './utils';

describe('Correction: god mode', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await tapCardOnList('catalog-section-recommended-items', 2);
  });

  it('should be able to enable god mode', async () => {
    await waitForVisible('header-slide-right');
    await element(by.id('header-slide-right')).tap();
    await waitForVisible('header-slide-right-god-mode');
  });

  it('should answer wrongly and see success correction', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-3')).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-success');
    await element(by.id('button-next-question')).tap();
  });

  it('should be able to disable god mode', async () => {
    await waitForVisible('header-slide-right-god-mode');
    await element(by.id('header-slide-right-god-mode')).tap();
    await waitForVisible('header-slide-right');
  });

  it('should answer wrongly and see failure correction', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-3')).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-error');
  });
});
