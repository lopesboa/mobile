// @flow

describe('Home', () => {
  before(async () => {
    await device.reloadReactNative();
  });

  it('should see todo mention', async () => {
    await expect(element(by.id('todo'))).toBeVisible();
  });
});
