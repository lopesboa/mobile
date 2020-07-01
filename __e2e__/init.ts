import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';
import json from '../package.json';

const config = json.detox;

// @ts-ignore jest type is incomplete
jasmine.getEnv().addReporter(adapter);
// @ts-ignore jest type is incomplete
jest.setTimeout(3000000);

beforeAll(async () => {
  await detox.init(config);
});

beforeEach(async function () {
  await adapter.beforeEach();
});

afterAll(async () => {
  await await adapter.afterAll();
  await detox.cleanup();
});
