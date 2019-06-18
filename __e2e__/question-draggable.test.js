// @flow strict

import {reloadApp, bypassAuthentication, tapCardOnSection, waitForVisible} from './utils';

const selectQCMRightDragItem = async (el: DetoxElement) => {
  await el(by.id(`choice-1-unselected`)).tap();
  await el(by.id(`choice-2-unselected`)).tap();
};

const tapOnCorrectQCMDRagItemAndGoToSuccess = async () => {
  await selectQCMRightDragItem(element);
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('button-validate')).tap();
  await waitForVisible('correction-success');
  await element(by.id('button-next-question')).tap();
};

describe('QCM Drag', () => {
  beforeAll(async () => {
    await reloadApp();
    await bypassAuthentication();
  });

  it('should see catalog and choose a discipline', async () => {
    await tapCardOnSection('catalog-section-recommended-items', 7);
  });

  it('should see only choice item', async () => {
    await weExpect(element(by.id(`choice-1-unselected`))).toBeVisible();
    await weExpect(element(by.id(`choice-1-selected`))).toBeNotVisible();
  });

  it('select some items and see them inside the dropzone', async () => {
    await selectQCMRightDragItem(element);
    await weExpect(element(by.id(`choice-1-unselected`))).toBeNotVisible();
    await weExpect(element(by.id(`choice-2-unselected`))).toBeNotVisible();
    await weExpect(element(by.id(`choice-1-selected`))).toBeVisible();
    await weExpect(element(by.id(`choice-2-selected`))).toBeVisible();
  });

  it('should be able to unselect some items from dropzone', async () => {
    await element(by.id(`choice-1-selected`)).tap();
    await element(by.id(`choice-2-selected`)).tap();
    await weExpect(element(by.id(`choice-1-unselected`))).toBeVisible();
    await weExpect(element(by.id(`choice-2-unselected`))).toBeVisible();
    await weExpect(element(by.id(`choice-1-selected`))).toBeNotVisible();
    await weExpect(element(by.id(`choice-2-selected`))).toBeNotVisible();
  });

  it('should be able to select few items and give the CORRECT answer', async () => {
    await selectQCMRightDragItem(element);
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-success');
    await element(by.id('button-next-question')).tap();
  });

  it('should be able to select few items and give the WRONG answer', async () => {
    await element(by.id(`choice-4-unselected`)).tap();
    await element(by.id(`choice-3-unselected`)).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-error');
    await element(by.id('button-next-question')).tap();
  });

  it('should be wrong if the given item are selected in wrong order when the match order matter', async () => {
    await tapOnCorrectQCMDRagItemAndGoToSuccess();
    await tapOnCorrectQCMDRagItemAndGoToSuccess();
    await element(by.id(`choice-2-unselected`)).tap();
    await element(by.id(`choice-1-unselected`)).tap();
    await element(by.id('button-validate')).tap();
    await waitForVisible('correction-error');
  });
});
