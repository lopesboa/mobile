// @flow strict

import {fakeError} from '../utils/tests';
import type {BuildFlavor, BuildType, BuildEnvironment, LogData} from './datadog';

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
    build: {
      type: 'adhoc',
      flavor: 'storybook',
      environment: 'production'
    }
  };

  describe('getBuildType', () => {
    it('should return distribution', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: true
      }));

      const {getBuildType} = require('./datadog');

      const result = getBuildType();
      const expected: BuildType = 'distribution';

      expect(result).toEqual(expected);
    });

    it('should return adhoc', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: true,
        __DISTRIBUTION__: false
      }));

      const {getBuildType} = require('./datadog');

      const result = getBuildType();
      const expected: BuildType = 'adhoc';

      expect(result).toEqual(expected);
    });

    it('should return undefined', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: false
      }));

      const {getBuildType} = require('./datadog');

      const result = getBuildType();

      expect(result).toBeUndefined;
    });
  });

  describe('getBuildFlavor', () => {
    it('should return e2e', () => {
      jest.mock('./environment', () => ({
        __E2E__: true,
        __STORYBOOK__: false
      }));

      const {getBuildFlavor} = require('./datadog');

      const result = getBuildFlavor();
      const expected: BuildFlavor = 'e2e';

      expect(result).toEqual(expected);
    });

    it('should return storybook', () => {
      jest.mock('./environment', () => ({
        __E2E__: false,
        __STORYBOOK__: true
      }));

      const {getBuildFlavor} = require('./datadog');

      const result = getBuildFlavor();
      const expected: BuildFlavor = 'storybook';

      expect(result).toEqual(expected);
    });

    it('should return undefined', () => {
      jest.mock('./environment', () => ({
        __E2E__: false,
        __STORYBOOK__: false
      }));

      const {getBuildFlavor} = require('./datadog');

      const result = getBuildFlavor();

      expect(result).toBeUndefined();
    });
  });

  describe('getBuildEnvironment', () => {
    it('should return test', () => {
      jest.mock('./environment', () => ({
        __TEST__: true,
        __DEV__: false,
        __PRODUCTION__: false
      }));

      const {getBuildEnvironment} = require('./datadog');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'test';

      expect(result).toEqual(expected);
    });

    it('should return development', () => {
      jest.mock('./environment', () => ({
        __TEST__: false,
        __DEV__: true,
        __PRODUCTION__: false
      }));

      const {getBuildEnvironment} = require('./datadog');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'development';

      expect(result).toEqual(expected);
    });

    it('should return production', () => {
      jest.mock('./environment', () => ({
        __TEST__: false,
        __DEV__: false,
        __PRODUCTION__: true
      }));

      const {getBuildEnvironment} = require('./datadog');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'production';

      expect(result).toEqual(expected);
    });
  });

  describe('getData', () => {
    it('should get data', () => {
      jest.mock('../../app', () => ({
        datadogToken: 'foobar'
      }));
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
        __STORYBOOK__: true,
        __ADHOC__: true
      }));
      const {getData} = require('./datadog');

      const result = getData(fakeError, context);

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
          'User-Agent':
            'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(expectedData)
      };

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
    });
  });
});
