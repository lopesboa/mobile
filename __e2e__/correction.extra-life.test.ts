import {reloadApp, bypassAuthentication, tapCardOnList, waitForExist} from './utils';

const wrongAnswer = async (el: Detox.Element, {clickOnNext = true}: {clickOnNext: boolean}) => {
  await el(by.id('question-screen')).swipe('up');
  await el(by.id('question-choice-1')).tap();
  await el(by.id('button-validate')).tap();
  await waitForExist('correction-error');

  if (clickOnNext) {
    await el(by.id('button-next-question')).tap();
  }
};

describe('Correction: extra-life', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    await tapCardOnList('catalog-section-recommended-items', 2);
    await waitForExist('question');
  });

  it('3 wrong answers', async () => {
    await wrongAnswer(element, {clickOnNext: true});
    await wrongAnswer(element, {clickOnNext: true});
    await wrongAnswer(element, {clickOnNext: false});
  });

  // TODO: Tests takes too long in the CI
  // it('should offer extralife', async () => {
  //   await weExpect(element(by.id('extra-life-resource-les_1'))).toBeVisible();
  //   await weExpect(element(by.id('button-quit'))).toBeVisible();
  //   await element(by.id('extra-life-resource-les_1')).tap();
  //   await weExpect(element(by.id('button-next-question'))).toBeVisible();
  //   await element(by.id('button-next-question')).tap();
  // });

  // it('a 4th wrong answer', async () => {
  //   await wrongAnswer(element, {clickOnNext: false});
  // });

  afterAll(async () => {
    await element(by.id('button-quit')).tap();
  });
});
