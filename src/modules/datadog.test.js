// @flow strict

import {fakeError} from '../utils/tests';
import type {LogData} from './datadog';

const expectedUserAgent =
  'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2; BuildEnvironment production; BuildType adhoc; BuildFlavor storybook)';

describe('Datadog', () => {
  beforeEach(async () => {
    await jest.resetModules();
  });

  afterEach(async () => {
    await jest.resetAllMocks();
  });

  const context = {brand: 'foo', platform: 'bar', userId: 'baz'};
  const expectedData: LogData = {
    ...context,
    apptype: 'mobile',
    level: 'error',
    err: {
      name: fakeError.name,
      message: fakeError.message,
      stack: fakeError.stack
    },
    ua: expectedUserAgent
  };

  describe('getData', () => {
    it('should get data', async () => {
      jest.mock('../../app', () => ({
        datadogToken: 'foobar'
      }));
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
        __STORYBOOK__: true,
        __ADHOC__: true
      }));
      const {getData} = require('./datadog');

      const result = await getData(fakeError, context);

      expect(result).toEqual(expectedData);
    });
  });

  describe('log', () => {
    it('should post data', async () => {
      jest.mock('../../app', () => ({
        datadogToken: 'foobar'
      }));
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
        __STORYBOOK__: true,
        __ADHOC__: true
      }));
      const fetch = require('cross-fetch');
      const {log} = require('./datadog');

      await log(fakeError, context);

      const expectedUrl = 'https://http-intake.logs.datadoghq.eu/v1/input/foobar';

      const expectedOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': expectedUserAgent,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(expectedData)
      };

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
    });
  });
});
