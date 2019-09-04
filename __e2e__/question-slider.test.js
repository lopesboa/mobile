// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForExist} from './utils';

describe('QCM Slider', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog, choose a discipline and see a question slider', async () => {
    await tapCardOnSection('catalog-section-recommended-items', 9);
    await waitForExist('question-slider');
  });

  it('should be able to see the slider question and the default', async () => {
    await weExpect(element(by.id('question-slider'))).toBeVisible();
    await waitForExist('slider-thumb');
    await waitForExist('slider-value');
    await weExpect(element(by.text('30'))).toHaveId('slider-value');
  });

  it('should display the min & the max value from the slider', async () => {
    await waitForExist('slider-values-container');
    await weExpect(element(by.id('slider-min-value'))).toExist();
    await weExpect(element(by.id('slider-max-value'))).toExist();
    await weExpect(element(by.id('slider-min-value'))).toHaveText('10 °C');
    await weExpect(element(by.id('slider-max-value'))).toHaveText('200 °C');
  });

  it('should be able to move the slider question and validate the answer', async () => {
    await element(by.id('slider-thumb')).swipe('right', 'slow', 0.1);
    await weExpect(element(by.text('200'))).toHaveId('slider-value');
    await weExpect(element(by.id('button-validate'))).toBeVisible();
    await element(by.id('button-validate')).tap();
  });
});
