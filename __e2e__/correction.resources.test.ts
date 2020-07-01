import {by, expect, element} from 'detox';
import {
  reloadApp,
  bypassAuthentication,
  tapCardOnList,
  waitForExist,
  // waitForNotVisible
} from './utils';

describe('Correction: resources', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
    await waitForExist('catalog-section-recommended-items-item-basic-dis-1');
    await tapCardOnList('catalog-section-recommended-items', 2);
    await waitForExist('question');
  });

  it('should be able to see ressource (pdf & video) in correction', async () => {
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('question-choice-1')).tap();
    await element(by.id('button-validate')).tap();
    await waitForExist('correction-error');
    await element(by.id('card-correction')).swipe('up');
    await expect(element(by.id('card-correction'))).toBeNotVisible();
    await expect(element(by.id('card-resource-les_1'))).toBeVisible();
    await expect(element(by.id('card-resource-les_2'))).toExist();
    await expect(element(by.id('card-resource-les_3'))).toExist();
    await expect(element(by.id('card-resource-les_4'))).toExist();
    await expect(element(by.id('button-next-question'))).toBeVisible();
  });

  it('should see lesson preview, lesson description when video', async () => {
    await waitForExist('card-resource-les_1-resource-preview-video');
    await expect(element(by.id('card-resource-les_1-resource-description'))).toBeVisible();
  });

  // TODO: Tests takes too long in the CI
  // it('should start the video', async () => {
  //   await element(by.id('card-resource-les_1-resource-preview-video')).tap();
  //   await waitForExist('card-resource-les_1-resource-video-container');
  // });

  // it('should pause the video', async () => {
  //   await element(by.id('video-pause')).tap();
  //   await expect(element(by.id('video-play'))).toBeVisible();
  //   await expect(element(by.id('video-pause'))).toBeNotVisible();
  // });

  // it('should resume the video', async () => {
  //   await element(by.id('video-play')).tap();
  //   await expect(element(by.id('video-play'))).toBeNotVisible();
  //   await expect(element(by.id('video-pause'))).toBeVisible();
  // });

  // it('should open the pdf', async () => {
  //   await element(by.id('card-resource-les_1')).swipe('up');
  //   await element(by.id('card-resource-les_2')).swipe('up');
  //   await element(by.id('card-resource-les_3')).swipe('up');
  //   await expect(element(by.id('card-resource-les_1'))).toBeNotVisible();
  //   await expect(element(by.id('card-resource-les_2'))).toBeNotVisible();
  //   await expect(element(by.id('card-resource-les_3'))).toBeNotVisible();
  //   await expect(element(by.id('card-resource-les_4'))).toBeVisible();
  //   await expect(element(by.id('card-resource-les_4-resource-preview-pdf'))).toBeVisible();
  //   await expect(element(by.id('card-resource-preview-pdf-icon'))).toBeVisible();
  //   await expect(element(by.id('button-open-pdf'))).toBeVisible();
  //   await element(by.id('button-open-pdf')).tap();
  //   await waitForExist('pdf-screen');
  // });

  // it('should close the pdf', async () => {
  //   await expect(element(by.id('pdf-button-close'))).toBeVisible();
  //   await element(by.id('pdf-button-close')).tap();
  //   await waitForNotVisible('pdf-screen');
  //   await expect(element(by.id('pdf-button-close'))).toBeNotVisible();
  // });
  afterAll(async () => {
    await element(by.id('button-next-question')).tap();
    await element(by.id('header-back')).tap();
  });
});
