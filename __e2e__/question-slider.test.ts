import {by, expect, element} from 'detox';
import {reloadApp, bypassAuthentication, tapCardOnList, waitForExist} from './utils';

describe('QCM Slider', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog, choose a discipline and see a question slider', async () => {
    await tapCardOnList('catalog-section-recommended-items', 9);
    await waitForExist('question-slider');
  });

  it('should be able to see the slider question and the default', async () => {
    await expect(element(by.id('question-slider'))).toBeVisible();
    await waitForExist('slider-thumb');
    await waitForExist('slider-value');
    await expect(element(by.text('30'))).toHaveId('slider-value');
  });

  it('should display the min & the max value from the slider', async () => {
    await waitForExist('slider-values-container');
    await expect(element(by.id('slider-min-value'))).toExist();
    await expect(element(by.id('slider-max-value'))).toExist();
    await expect(element(by.id('slider-min-value'))).toHaveText('10 °C');
    await expect(element(by.id('slider-max-value'))).toHaveText('200 °C');
  });

  it('should be able to move the slider question and validate the answer', async () => {
    await element(by.id('slider-thumb')).swipe('right', 'slow', 0.1);
    await expect(element(by.text('200'))).toHaveId('slider-value');
    await expect(element(by.id('button-validate'))).toBeVisible();
    await element(by.id('button-validate')).tap();
  });
});
