// @flow

const detox = require('detox');

const config = require('../package.json').detox;

const utils = require('./utils.js');

before(async () => {
  await detox.init(config);
  await device.launchApp();

  utils.init();
});

after(() => detox.cleanup());
