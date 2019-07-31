// @flow

import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';
import json from '../package';

const config = json.detox;

// $FlowFixMe jest flow type is incomplete
jasmine.getEnv().addReporter(adapter);
jest.setTimeout(120000);

beforeAll(async () => {
  await detox.init(config);

  // since we mix jest & detox in our codebase, we cannot use flow
  // with a single config that mix multiples interfaces
  // here is a simple trick to avoid much pain
  // (we force weExpect type to match what we want)
  global.weExpect = expect;
});

beforeEach(async function() {
  await adapter.beforeEach();
});

afterAll(async () => {
  await await adapter.afterAll();
  await detox.cleanup();
});
