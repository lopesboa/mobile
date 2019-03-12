// @flow

const selectQCMRightDragItem = async () => {
  await element(by.id(`choice-1-unselected`)).tap();
  await element(by.id(`choice-2-unselected`)).tap();
};

const tapOnCorrectQCMDRagItemAndGoToSuccess = async () => {
  await selectQCMRightDragItem();
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('button-validate')).tap();
  await waitFor(element(by.id('correction-success'))).toBeVisible();
  await element(by.id('button-next-question')).tap();
};
describe('QCM Drag', () => {
  beforeAll(async () => {
    await waitFor(element(by.id('catalog-item-qcm-drag-dis-1'))).toBeVisible();
    await element(by.id('home-screen')).swipe('up');
    await element(by.id('catalog-item-qcm-drag-dis-1')).tap();
  });

  it('should see only choice item', async () => {
    await weExpect(element(by.id(`choice-1-unselected`))).toBeVisible();
    await weExpect(element(by.id(`choice-1-selected`))).toBeNotVisible();
  });

  it('select some items and see them inside the dropzone', async () => {
    await selectQCMRightDragItem();
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
    await selectQCMRightDragItem();
    await element(by.id('question-screen')).swipe('up');
    await element(by.id('button-validate')).tap();
    await waitFor(element(by.id('correction-success'))).toBeVisible();
    await weExpect(element(by.id('correction-success'))).toBeVisible();
    await element(by.id('button-next-question')).tap();
  });

  it('should be able to select few items and give the WRONG answer', async () => {
    await element(by.id(`choice-4-unselected`)).tap();
    await element(by.id(`choice-3-unselected`)).tap();
    await element(by.id('button-validate')).tap();
    await waitFor(element(by.id('correction-error'))).toBeVisible();
    await weExpect(element(by.id('correction-error'))).toBeVisible();
    await element(by.id('button-next-question')).tap();
  });

  it('should be wrong if the given item are selected in wrong order when the match order matter', async () => {
    await tapOnCorrectQCMDRagItemAndGoToSuccess();
    await tapOnCorrectQCMDRagItemAndGoToSuccess();
    await element(by.id(`choice-2-unselected`)).tap();
    await element(by.id(`choice-1-unselected`)).tap();
    await element(by.id('button-validate')).tap();
    await waitFor(element(by.id('correction-error'))).toBeVisible();
    await weExpect(element(by.id('correction-error'))).toBeVisible();
  });
});
