// @flow strict

import utils from './utils';

const rightAnswer = async () => {
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('question-choice-2')).tap();
  await element(by.id('button-validate')).tap();
};

describe('Questions', () => {
  beforeAll(async () => {
    await utils.reloadApp();
    await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-basic-dis-1')).tap();
  });

  it('should see QCM elements', async () => {
    await waitFor(element(by.id('question'))).toBeVisible();
    await weExpect(element(by.id('question-title'))).toBeVisible();
    await weExpect(element(by.id('explanation'))).toBeVisible();
    await weExpect(element(by.id('question-image'))).toBeVisible();
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
        await waitFor(element(by.id('correction-error'))).toBeVisible();
      });

      it('should see elements', async () => {
        await weExpect(element(by.id('correction-error'))).toBeVisible();
        await weExpect(element(by.id('correction-title'))).toBeVisible();
        await weExpect(element(by.id('correction-subtitle'))).toBeVisible();
        await weExpect(element(by.id('card-correction'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toExist();
        await weExpect(element(by.id('card-tip'))).toExist();
      });

      it('should lose a life', async () => {
        await weExpect(element(by.id('correction-lives-2-broken'))).toBeVisible();
      });

      it('should be able to swipe to key point card', async () => {
        await element(by.id('card-correction')).swipe('up');
        await weExpect(element(by.id('card-correction'))).toBeNotVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeVisible();
        await weExpect(element(by.id('card-tip'))).toBeNotVisible();
      });

      it('should be able to swipe to tip card', async () => {
        await element(by.id('card-keypoint')).swipe('left');
        await weExpect(element(by.id('card-correction'))).toBeNotVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeNotVisible();
        await weExpect(element(by.id('card-tip'))).toBeVisible();
      });

      it('should back to the first card', async () => {
        await element(by.id('card-tip')).swipe('right');
        await weExpect(element(by.id('card-correction'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeNotVisible();
        await weExpect(element(by.id('card-tip'))).toBeNotVisible();
      });

      it('should back to the question', async () => {
        await weExpect(element(by.id('button-next-question'))).toBeVisible();
        await element(by.id('button-next-question')).tap();
        await waitFor(element(by.id('question'))).toBeVisible();
      });

      it('should see lives updated', async () => {
        await weExpect(element(by.id('lives-2'))).toBeVisible();
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
        await waitFor(element(by.id('correction-success'))).toBeVisible();
      });

      it('should see elements', async () => {
        await weExpect(element(by.id('correction-success'))).toBeVisible();
        await weExpect(element(by.id('correction-title'))).toBeVisible();
        await weExpect(element(by.id('correction-subtitle'))).toBeVisible();
        await weExpect(element(by.id('card-tip'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toExist();
        await weExpect(element(by.id('card-correction'))).toExist();
      });

      it('should keep lives', async () => {
        await weExpect(element(by.id('correction-lives-2'))).toBeVisible();
      });

      it('should be able to swipe to correction card', async () => {
        await element(by.id('card-tip')).swipe('up');
        await weExpect(element(by.id('card-tip'))).toBeNotVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeVisible();
        await weExpect(element(by.id('card-correction'))).toBeNotVisible();
      });

      it('should be able to swipe to tip card', async () => {
        await element(by.id('card-keypoint')).swipe('left');
        await weExpect(element(by.id('card-tip'))).toBeNotVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeNotVisible();
        await weExpect(element(by.id('card-correction'))).toBeVisible();
      });

      it('should back to the first card', async () => {
        await element(by.id('card-correction')).swipe('right');
        await weExpect(element(by.id('card-tip'))).toBeVisible();
        await weExpect(element(by.id('card-keypoint'))).toBeNotVisible();
        await weExpect(element(by.id('card-correction'))).toBeNotVisible();
      });

      it('should be able to close the modal', async () => {
        await weExpect(element(by.id('button-next-question'))).toBeVisible();
        await element(by.id('button-next-question')).tap();
        await waitFor(element(by.id('question'))).toBeVisible();
      });

      it('should see lives', async () => {
        await weExpect(element(by.id('lives-2'))).toBeVisible();
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
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('should see choices with images', async () => {
      await weExpect(element(by.id('question-choice-1-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-2-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-3-img'))).toBeVisible();
      await weExpect(element(by.id('question-choice-4-img'))).toBeVisible();
    });
  });

  describe('Level end', () => {
    beforeAll(async () => {
      // fast forward to the end
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
      await rightAnswer();
      await waitFor(element(by.id('correction-success'))).toBeVisible();
    });

    it('should see a button to continue', async () => {
      await waitFor(element(by.id('correction-success'))).toBeVisible();
      await weExpect(element(by.id('button-next'))).toBeVisible();
    });

    it('should navigate to level end', async () => {
      await element(by.id('button-next')).tap();
      await waitFor(element(by.id('level-end-success'))).toBeVisible();
      await weExpect(element(by.id('level-end-success'))).toBeVisible();
    });

    it('should see elements', async () => {
      await weExpect(element(by.id('level-end-title'))).toBeVisible();
      await weExpect(element(by.id('button-next-level'))).toBeVisible();
    });

    it('should back to home', async () => {
      await element(by.id('button-next-level')).tap();
      await waitFor(element(by.id('home'))).toBeVisible();
      await weExpect(element(by.id('home'))).toBeVisible();
    });
  });
});
