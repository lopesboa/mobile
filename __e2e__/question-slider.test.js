// @flow strict

import {reloadApp, bypassAuthentication} from './utils';

describe('QCM Slider', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication(element);
  });

  it('shoould see catalog, choose a discipline and see a question slider', async () => {
    await waitFor(element(by.id('catalog-item-qcm-drag-dis-1'))).toExist();
    await element(by.id('home-screen')).swipe('up');
    await waitFor(element(by.id('catalog-item-with-slider-dis-1'))).toBeVisible();
    await element(by.id('catalog-item-with-slider-dis-1')).tap();
    await waitFor(element(by.id('question-slider'))).toBeVisible();
  });

  it('should be able to see the slider question and the default', async () => {
    await weExpect(element(by.id('question-slider'))).toBeVisible();
    await waitFor(element(by.id('slider-thumb'))).toBeVisible();
    await weExpect(element(by.id('slider-thumb'))).toBeVisible();
    await waitFor(element(by.id('slider-value'))).toBeVisible();
    await weExpect(element(by.text('30'))).toHaveId('slider-value');
  });

  it('should display the min & the max value from the slider', async () => {
    await waitFor(element(by.id('slider-values-container'))).toBeVisible();
    await weExpect(element(by.id('slider-values-container'))).toBeVisible();
    await weExpect(element(by.id('slider-min-value'))).toExist();
    await weExpect(element(by.id('slider-max-value'))).toExist();
    await weExpect(element(by.id('slider-min-value'))).toHaveText('10 ');
    await weExpect(element(by.id('slider-max-value'))).toHaveText('200 ');
  });

  it('should be able to move the slider question and validate the answer', async () => {
    await element(by.id('slider-thumb')).swipe('right', 'slow', 0.1);
    await weExpect(element(by.text('200'))).toHaveId('slider-value');
    await weExpect(element(by.id('button-validate'))).toBeVisible();
    await element(by.id('button-validate')).tap();
  });

  it('should back to home', async () => {
    await element(by.id('button-next-question')).tap();
    await element(by.id('header-back')).tap();
  });
});
