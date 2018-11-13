// @flow

// require('babel-polyfill');
const detox = require('detox');

const config = require('../package.json').detox;

const utils = require('./utils.js');

before(async () => {
  await detox.init(config);

  utils.init();
});
after(async () => await detox.cleanup());
