// @flow strict

import utils from './utils';

describe('Slide', () => {
  beforeAll(utils.reloadApp);

  it('should see question elements', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
    await weExpect(element(by.id('question-header'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-choices'))).toBeVisible();
    await weExpect(element(by.id('button-validate-disabled'))).toBeVisible();
  });

  it('should not see feedback elements', async () => {
    await weExpect(element(by.id('correction-success'))).toBeNotVisible();
    await weExpect(element(by.id('correction-error'))).toBeNotVisible();
    await weExpect(element(by.id('chapter-end'))).toBeNotVisible();
  });

  it('should be able to answer', async () => {
    await element(by.id('question-choice-1')).tap();
    await weExpect(element(by.id('question-choice-1-selected'))).toBeVisible();
    await weExpect(element(by.id('button-validate'))).toBeVisible();
  });

  it('should be able to select multiple answers', async () => {
    await element(by.id('question-choice-2')).tap();
    await weExpect(element(by.id('question-choice-1-selected'))).toBeVisible();
    await weExpect(element(by.id('question-choice-2-selected'))).toBeVisible();
  });

  it('should have negative feedback when my answer is incorrect', async () => {
    await element(by.id('button-validate')).tap();
    await weExpect(element(by.id('correction-error'))).toBeVisible();
  });

  it('should have positive feedback when my answer is correct', async () => {
    await element(by.id('question-choice-1-selected')).tap();
    await weExpect(element(by.id('question-choice-1'))).toBeVisible();
    await element(by.id('button-validate')).tap();
    await weExpect(element(by.id('correction-success'))).toBeVisible();
  });

  it('should see an image', async () => {
    await weExpect(element(by.id('question-image'))).toBeVisible();
  });

  it('should see a end message after the last question', async () => {
    await element(by.id('question-choice-2')).tap();
    await element(by.id('slide-screen')).swipe('up');
    await element(by.id('button-validate')).tap();
    await element(by.id('question-choice-2')).tap();
    await element(by.id('button-validate')).tap();
    // @todo: remove this action once we have a modal
    await element(by.id('slide-screen')).swipe('down');
    await weExpect(element(by.id('chapter-end'))).toBeVisible();
  });
});
