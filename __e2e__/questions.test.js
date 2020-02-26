// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

const rightAnswer = async (el: DetoxElement) => {
  await el(by.id('question-screen')).swipe('up');
  await el(by.id('question-choice-2')).tap();
  await el(by.id('button-validate')).tap();
};

// @todo split this file into few files (1 per question type)

describe('Questions', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see the catalog and choose a discipline', async () => {
    await tapCardOnSection('catalog-section-recommended-items', 2);
  });

  it('should see QCM elements', async () => {
    await waitForExist('question');
    await weExpect(element(by.id('question-title'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-resource'))).toBeVisible();
    await element(by.id('question-screen')).swipe('up');
    await weExpect(element(by.id('question-choices'))).toBeVisible();
    await weExpect(element(by.id('button-validate-disabled'))).toBeVisible();
  });
  it('should not see correction elements', async () => {
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
  describe('Correction', () => {
    describe('Negative', () => {
      beforeAll(async () => {
        await element(by.id('question-screen')).swipe('up');
        await element(by.id('button-validate')).tap();
      });
      it('should see elements', async () => {
        await waitForExist('correction-error');
        await weExpect(element(by.id('correction-title'))).toBeVisible();
        await weExpect(element(by.id('correction-explanation'))).toBeVisible();
        await weExpect(element(by.id('card-correction'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toExist();
        await weExpect(element(by.id('card-tip'))).toExist();
      });
      it('should lose a life', async () => {
        await weExpect(element(by.id('correction-lives-3-broken'))).toBeVisible();
      });
      it('should be able to swipe resources cards', async () => {
        await element(by.id('card-correction')).swipe('up');
        await element(by.id('card-resource-les_1')).swipe('left');
        await weExpect(element(by.id('card-resource-les_1-video'))).toBeNotVisible();
        await element(by.id('card-resource-les_2')).swipe('left');
        await weExpect(element(by.id('card-resource-les_2-video'))).toBeNotVisible();
        await element(by.id('card-resource-les_3')).swipe('left');
        await weExpect(element(by.id('card-resource-les_3-video'))).toBeNotVisible();
        await element(by.id('card-resource-les_4')).swipe('left');
        await weExpect(element(by.id('card-resource-les_4-pdf'))).toBeNotVisible();
      });

      it('should see key-point card', async () => {
        await weExpect(element(by.id('card-keypoint'))).toBeVisible();
      });
      it('should be able to swipe to tip card', async () => {
        await element(by.id('card-keypoint')).swipe('left');
        await weExpect(element(by.id('card-tip'))).toBeVisible();
      });
      it('should back to the first card', async () => {
        await element(by.id('card-tip')).swipe('right');
        await weExpect(element(by.id('card-correction'))).toBeVisible();
      });
      it('should back to the question', async () => {
        await weExpect(element(by.id('button-next-question'))).toBeVisible();
        await element(by.id('button-next-question')).tap();
        await waitForExist('question');
      });
      it('should see lives updated', async () => {
        await weExpect(element(by.id('lives-3'))).toBeVisible();
      });
      it('should see the progression change', async () => {
        await weExpect(element(by.id('progression-bar-1'))).toBeNotVisible();
        await weExpect(element(by.id('progression-bar-2'))).toBeVisible();
      });
    });
    describe('Positive', () => {
      beforeAll(async () => {
        await element(by.id('question-screen')).swipe('up');
        await element(by.id('question-choice-2')).tap();
        await weExpect(element(by.id('question-choice-2-selected'))).toBeVisible();
        await element(by.id('button-validate')).tap();
        await waitForExist('correction-success');
      });
      it('should see elements', async () => {
        await weExpect(element(by.id('correction-success'))).toBeVisible();
        await weExpect(element(by.id('correction-title'))).toBeVisible();
        await weExpect(element(by.id('correction-explanation'))).toBeVisible();
        await weExpect(element(by.id('card-tip'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toExist();
        await weExpect(element(by.id('card-correction'))).toExist();
      });
      it('should keep lives', async () => {
        await weExpect(element(by.id('correction-lives-3'))).toBeVisible();
      });
      it('should be able to swipe to correction card', async () => {
        await element(by.id('card-tip')).swipe('up');
        await weExpect(element(by.id('card-tip'))).toBeNotVisible();
        await element(by.id('card-resource-les_1')).swipe('left');
        await weExpect(element(by.id('card-resource-les_1'))).toBeNotVisible();
        await element(by.id('card-resource-les_2')).swipe('left');
        await weExpect(element(by.id('card-resource-les_2'))).toBeNotVisible();
        await element(by.id('card-resource-les_3')).swipe('left');
        await weExpect(element(by.id('card-resource-les_3'))).toBeNotVisible();
        await element(by.id('card-resource-les_4')).swipe('left');
        await weExpect(element(by.id('card-resource-les_4'))).toBeNotVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeVisible();
      });
      it('should be able to swipe to tip card', async () => {
        await element(by.id('card-keypoint')).swipe('left');
        await weExpect(element(by.id('card-correction'))).toBeVisible();
      });
      it('should back to the first card', async () => {
        await element(by.id('card-correction')).swipe('right');
        await weExpect(element(by.id('card-tip'))).toBeVisible();
      });
      it('should be able to close the modal', async () => {
        await weExpect(element(by.id('button-next-question'))).toBeVisible();
        await element(by.id('button-next-question')).tap();
        await waitForExist('question');
      });
      it('should see lives', async () => {
        await weExpect(element(by.id('lives-3'))).toBeVisible();
      });
      it('should see the progression change', async () => {
        await weExpect(element(by.id('progression-bar-2'))).toBeNotVisible();
        await weExpect(element(by.id('progression-bar-3'))).toBeVisible();
      });
    });
  });
  describe('QCM Graphic', () => {
    beforeAll(async () => {
      // fast forward to next chapter
      await rightAnswer(element);
      await waitForExist('correction-success');
      await element(by.id('button-next-question')).tap();
      await rightAnswer(element);
      await waitForExist('correction-success');
      await element(by.id('button-next-question')).tap();
      await element(by.id('question-screen')).swipe('up');
    });
    it('should see choices with images', async () => {
      await weExpect(element(by.id('question-choice-1-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-2-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-3-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-4-img'))).toBeVisible();
    });
  });
});
