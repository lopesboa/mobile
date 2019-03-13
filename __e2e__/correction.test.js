// @flow strict

import utils from './utils';

describe('Correction', () => {
  describe('Resources', () => {
    beforeAll(async () => {
      await utils.reloadApp();
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
      await waitFor(element(by.id('question'))).toBeVisible();
    });

    it('should be able to see ressource (pdf & video) in correction', async () => {
      await element(by.id('question-screen')).swipe('up');
      await element(by.id('question-choice-1')).tap();
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('correction-error'))).toBeVisible();
      await element(by.id('card-correction')).swipe('up');
      await weExpect(element(by.id('card-correction'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_1'))).toBeVisible();
      await weExpect(element(by.id('card-resource-les_2'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_2'))).toExist();
      await weExpect(element(by.id('card-resource-les_3'))).toExist();
      await weExpect(element(by.id('card-resource-les_4'))).toExist();
      await weExpect(element(by.id('button-next-question'))).toBeVisible();
    });

    it('should see lesson preview, lesson description when video', async () => {
      await waitFor(element(by.id('preview-video-les_1'))).toBeVisible();
      await weExpect(element(by.id('preview-video-les_1'))).toBeVisible();
      await weExpect(element(by.id('resource-description-les_1'))).toBeVisible();
    });

    it('should start the video', async () => {
      await element(by.id('preview-video-les_1')).tap();
      await waitFor(element(by.id('video-container-les_1'))).toBeVisible();
      await weExpect(element(by.id('video-container-les_1'))).toBeVisible();
    });

    it('should pause the video', async () => {
      await element(by.id('video-pause')).tap();
      await weExpect(element(by.id('video-play'))).toBeVisible();
      await weExpect(element(by.id('video-pause'))).toBeNotVisible();
    });

    it('should resume the video', async () => {
      await element(by.id('video-play')).tap();
      await weExpect(element(by.id('video-play'))).toBeNotVisible();
      await weExpect(element(by.id('video-pause'))).toBeVisible();
    });

    it('should open the pdf', async () => {
      await element(by.id('card-resource-les_1')).swipe('up');
      await element(by.id('card-resource-les_2')).swipe('up');
      await element(by.id('card-resource-les_3')).swipe('up');
      await weExpect(element(by.id('card-resource-les_1'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_2'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_3'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_4'))).toBeVisible();
      await weExpect(element(by.id('preview-pdf-les_4'))).toBeVisible();
      await weExpect(element(by.id('preview-pdf-icon'))).toBeVisible();
      await weExpect(element(by.id('button-open-pdf'))).toBeVisible();
      await element(by.id('button-open-pdf')).tap();
      await waitFor(element(by.id('pdf-screen'))).toBeVisible();
      await weExpect(element(by.id('pdf-screen'))).toBeVisible();
    });

    it('should close the pdf', async () => {
      await weExpect(element(by.id('button-close'))).toBeVisible();
      await element(by.id('button-close')).tap();
      await waitFor(element(by.id('pdf-screen'))).toBeNotVisible();
      await weExpect(element(by.id('pdf-screen'))).toBeNotVisible();
      await weExpect(element(by.id('button-close'))).toBeNotVisible();
      await element(by.id('button-next-question')).tap();
    });
  });
  describe('Error', () => {
    beforeAll(async () => {
      await device.launchApp({newInstance: true});
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
      await waitFor(element(by.id('question'))).toBeVisible();
    });
    it('wrong answer but lesson not seen, lesson should start card 2', async () => {
      await element(by.id('question-screen')).swipe('up');
      await element(by.id('question-choice-1')).tap();
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await weExpect(element(by.id('correction-error'))).toBeVisible();
      await element(by.id('card-correction')).swipe('up');
      await weExpect(element(by.id('card-correction'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_1'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('wrong answer but lesson seen, lesson should start card 3', async () => {
      await utils.getLessonTab(element).tap();
      await element(by.id('preview-video')).tap();
      await waitFor(element(by.id('video-container'))).toBeVisible();
      await waitFor(element(by.id('video-container-container'))).toBeNotVisible();
      await waitFor(element(by.id('video-container'))).toBeVisible();
      await waitFor(element(by.id('video'))).toBeVisible();
      await waitFor(element(by.id('video-pause'))).toBeVisible();
      await waitFor(element(by.id('video-play'))).toBeNotVisible();
      await waitFor(element(by.id('video-seekbar'))).toBeVisible();
      await waitFor(element(by.id('video-timer'))).toBeVisible();
      await waitFor(element(by.id('video-fullscreen-expand'))).toBeVisible();
      await element(by.id('video-pause')).tap();
      await utils.getQuestionTab(element).tap();
      await element(by.id('question-screen')).swipe('up');
      await element(by.id('question-choice-1')).tap();
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await waitFor(element(by.id('card-correction'))).toBeVisible();
      await element(by.id('card-correction')).swipe('up');
      await element(by.id('card-keypoint')).swipe('up');
      await weExpect(element(by.id('card-keypoint'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_1'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });
  });

  describe('Success', () => {
    beforeAll(async () => {
      await device.launchApp({newInstance: true});
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
      await waitFor(element(by.id('question'))).toBeVisible();
    });
    it('right answer but lesson not seen, lesson should start card 2', async () => {
      await element(by.id('question-screen')).swipe('up');
      await element(by.id('question-choice-2')).tap();
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('card-tip'))).toBeVisible();
      await weExpect(element(by.id('card-tip'))).toBeVisible();
      await element(by.id('card-tip')).swipe('up');
      await weExpect(element(by.id('card-tip'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_1'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });

    it('right answer but lesson seen, lesson should start card 4', async () => {
      await utils.getLessonTab(element).tap();
      await element(by.id('preview-video')).tap();
      await waitFor(element(by.id('video-container'))).toBeVisible();
      await waitFor(element(by.id('video-container-container'))).toBeNotVisible();
      await waitFor(element(by.id('video-container'))).toBeVisible();
      await waitFor(element(by.id('video'))).toBeVisible();
      await waitFor(element(by.id('video-pause'))).toBeVisible();
      await waitFor(element(by.id('video-play'))).toBeNotVisible();
      await waitFor(element(by.id('video-seekbar'))).toBeVisible();
      await waitFor(element(by.id('video-timer'))).toBeVisible();
      await waitFor(element(by.id('video-fullscreen-expand'))).toBeVisible();
      await element(by.id('video-pause')).tap();
      await utils.getQuestionTab(element).tap();
      await element(by.id('question-screen')).swipe('up');
      await element(by.id('question-choice-2')).tap();
      await element(by.id('button-validate')).tap();
      await waitFor(element(by.id('correction-error'))).toBeVisible();
      await waitFor(element(by.id('card-tip'))).toBeVisible();
      await element(by.id('card-tip')).swipe('up');
      await element(by.id('card-keypoint')).swipe('up');
      await element(by.id('card-correction')).swipe('up');
      await weExpect(element(by.id('card-correction'))).toBeNotVisible();
      await weExpect(element(by.id('card-resource-les_1'))).toBeVisible();
      await element(by.id('button-next-question')).tap();
    });
  });
});
