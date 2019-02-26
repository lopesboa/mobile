// @flow strict

import utils from './utils';

describe('Lesson', () => {
  beforeAll(async () => {
    await utils.reloadApp();
  });

  describe('More than 1 resource', () => {
    beforeAll(async () => {
      await waitFor(element(by.id('catalog-item-basic-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-basic-dis-1')).tap();
    });

    it('should see lesson tab', async () => {
      await waitFor(utils.getLessonTab(element)).toBeVisible();
      await weExpect(utils.getLessonTab(element)).toBeVisible();
    });

    it('should be redirected to lesson tab', async () => {
      await utils.getLessonTab(element).tap();
      await waitFor(element(by.id('lesson-screen'))).toBeVisible();
      await weExpect(element(by.id('lesson-screen'))).toBeVisible();
    });

    it('should see resources browser', async () => {
      await weExpect(element(by.id('resources-browser'))).toExist();
    });

    it('should see a stars note', async () => {
      await weExpect(element(by.id('additional-stars-note'))).toBeVisible();
    });

    it('should see the first resource selected', async () => {
      await weExpect(element(by.id('resource-les-1-selected'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-thumbnail'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-description'))).toBeVisible();
      await weExpect(element(by.id('resource-les-1-video-icon'))).toBeNotVisible();
    });

    describe('Video', () => {
      it('should see a video preview', async () => {
        await weExpect(element(by.id('preview-video'))).toBeVisible();
        await weExpect(element(by.id('video'))).toBeNotVisible();
        await weExpect(element(by.id('video-replay'))).toBeNotVisible();
      });

      it('should start the video', async () => {
        await element(by.id('preview-video')).tap();
        await waitFor(element(by.id('video-container'))).toBeVisible();
        await weExpect(element(by.id('video-container-container'))).toBeNotVisible();
        await weExpect(element(by.id('video-container'))).toBeVisible();
        await weExpect(element(by.id('video'))).toBeVisible();
        await weExpect(element(by.id('video-pause'))).toBeVisible();
        await weExpect(element(by.id('video-play'))).toBeNotVisible();
        await weExpect(element(by.id('video-seekbar'))).toBeVisible();
        await weExpect(element(by.id('video-timer'))).toBeVisible();
        await weExpect(element(by.id('video-fullscreen-expand'))).toBeVisible();
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

      it('should fast forward the video', async () => {
        await element(by.id('video-seekbar-pin')).swipe('right');
        await waitFor(element(by.id('video-replay'))).toBeVisible();
        await weExpect(element(by.id('video-replay'))).toBeVisible();
      });

      it('should replay the video', async () => {
        await element(by.id('video-replay')).tap();
        await weExpect(element(by.id('video-replay'))).toBeNotVisible();
        await weExpect(element(by.id('video'))).toBeVisible();
      });

      // This is not possible to test it with iOS native fullscreen

      // it('should expand the video', async () => {
      //   await element(by.id('video-fullscreen-expand')).tap();
      //   await waitFor(element(by.id('video-container-fullscreen'))).toBeVisible();
      //   await weExpect(element(by.id('video-container'))).toBeNotVisible();
      //   await weExpect(element(by.id('video-container-fullscreen'))).toBeVisible();
      //   await weExpect(element(by.id('video-fullscreen-shrink'))).toBeVisible();
      // });
      //
      // it('should shrink the video', async () => {
      //   await element(by.id('video-fullscreen-shrink')).tap();
      //   await waitFor(element(by.id('video-container'))).toBeVisible();
      //   await weExpect(element(by.id('video-container'))).toBeVisible();
      //   await weExpect(element(by.id('video-container-fullscreen'))).toBeNotVisible();
      //   await weExpect(element(by.id('video-fullscreen-expand'))).toBeVisible();
      // });
    });

    describe('Browser', () => {
      it('should scroll to pdf resource', async () => {
        await element(by.id('resources')).swipe('up');
        await weExpect(element(by.id('resource-les-4'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-thumbnail'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-description'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-pdf-icon'))).toBeVisible();
      });

      it('should be able to select the pdf resource', async () => {
        await element(by.id('resource-les-4')).tap();
        await weExpect(element(by.id('resource-les-4-selected'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-thumbnail'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-description'))).toBeVisible();
        await weExpect(element(by.id('resource-les-4-video-icon'))).toBeNotVisible();
      });
    });

    describe('Pdf', () => {
      it('should see elements', async () => {
        await weExpect(element(by.id('preview-pdf'))).toBeVisible();
        await weExpect(element(by.id('preview-pdf-icon'))).toBeVisible();
        await weExpect(element(by.id('button-open-pdf'))).toBeVisible();
      });

      it('should open the pdf', async () => {
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
      });
    });
  });

  describe('1 resource only', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await waitFor(element(by.id('catalog-item-adaptive-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-adaptive-dis-1')).tap();
      await utils.getLessonTab(element).tap();
    });

    it('should see lesson tab', async () => {
      await waitFor(utils.getLessonTab(element)).toBeVisible();
      await weExpect(utils.getLessonTab(element)).toBeVisible();
    });

    it('should be redirected to lesson tab', async () => {
      await utils.getLessonTab(element).tap();
      await waitFor(element(by.id('lesson-screen'))).toBeVisible();
      await weExpect(element(by.id('lesson-screen'))).toBeVisible();
    });

    it('should not see resources browser', async () => {
      await waitFor(element(by.id('resources-browser'))).toNotExist();
    });
  });

  describe('Without resource', () => {
    beforeAll(async () => {
      await element(by.id('header-back')).tap();
      await waitFor(element(by.id('catalog-item-no-clue-dis-1'))).toBeVisible();
      await element(by.id('catalog-item-no-clue-dis-1')).tap();
    });

    it('should see lesson tab', async () => {
      await waitFor(utils.getLessonTab(element)).toBeVisible();
      await weExpect(utils.getLessonTab(element)).toBeVisible();
    });

    it('should not be redirected to lesson tab', async () => {
      await utils.getLessonTab(element).tap();
      await weExpect(element(by.id('lesson-screen'))).toBeNotVisible();
    });
  });
});
