// @flow

const utils = require('./utils.js');

describe('Home', () => {
  before(utils.reloadApp);

  it('should see todo mention', async () => {
    await weExpect(element(by.id('todo'))).toBeVisible();
  });
});
