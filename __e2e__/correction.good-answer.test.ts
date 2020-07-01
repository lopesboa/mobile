import {by, element} from 'detox';
import {reloadApp, bypassAuthentication, tapCardOnList, waitForExist} from './utils';

describe('Correction: good answer', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    await tapCardOnList('catalog-section-recommended-items', 2);
    await waitForExist('question');
  });

  it('answer successfully and see correction', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-2')).tap();
    await element(by.id('button-validate')).tap();
    await waitForExist('correction-success');
    await element(by.id('button-next-question')).tap();
  });
});
