import type {BuildType, BuildFlavor, BuildEnvironment} from './build';

describe('Build', () => {
  beforeEach(async () => {
    await jest.resetModules();
  });

  afterEach(async () => {
    await jest.resetAllMocks();
  });

  describe('getBuildType', () => {
    it('should return distribution', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: true,
      }));

      const {getBuildType} = require('./build');

      const result = getBuildType();
      const expected: BuildType = 'distribution';

      expect(result).toEqual(expected);
    });

    it('should return adhoc', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: true,
        __DISTRIBUTION__: false,
      }));

      const {getBuildType} = require('./build');

      const result = getBuildType();
      const expected: BuildType = 'adhoc';

      expect(result).toEqual(expected);
    });

    it('should return undefined', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: false,
      }));

      const {getBuildType} = require('./build');

      const result = getBuildType();

      expect(result).toBeUndefined;
    });
  });

  describe('getBuildFlavor', () => {
    it('should return e2e', () => {
      jest.mock('./environment', () => ({
        __E2E__: true,
        __STORYBOOK__: false,
      }));

      const {getBuildFlavor} = require('./build');

      const result = getBuildFlavor();
      const expected: BuildFlavor = 'e2e';

      expect(result).toEqual(expected);
    });

    it('should return storybook', () => {
      jest.mock('./environment', () => ({
        __E2E__: false,
        __STORYBOOK__: true,
      }));

      const {getBuildFlavor} = require('./build');

      const result = getBuildFlavor();
      const expected: BuildFlavor = 'storybook';

      expect(result).toEqual(expected);
    });

    it('should return undefined', () => {
      jest.mock('./environment', () => ({
        __E2E__: false,
        __STORYBOOK__: false,
      }));

      const {getBuildFlavor} = require('./build');

      const result = getBuildFlavor();

      expect(result).toBeUndefined();
    });
  });

  describe('getBuildEnvironment', () => {
    it('should return test', () => {
      jest.mock('./environment', () => ({
        __TEST__: true,
        __DEV__: false,
        __PRODUCTION__: false,
      }));

      const {getBuildEnvironment} = require('./build');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'test';

      expect(result).toEqual(expected);
    });

    it('should return development', () => {
      jest.mock('./environment', () => ({
        __TEST__: false,
        __DEV__: true,
        __PRODUCTION__: false,
      }));

      const {getBuildEnvironment} = require('./build');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'development';

      expect(result).toEqual(expected);
    });

    it('should return production', () => {
      jest.mock('./environment', () => ({
        __TEST__: false,
        __DEV__: false,
        __PRODUCTION__: true,
      }));

      const {getBuildEnvironment} = require('./build');

      const result = getBuildEnvironment();
      const expected: BuildEnvironment = 'production';

      expect(result).toEqual(expected);
    });
  });

  describe('getBuildExtension', () => {
    it('should get build info', () => {
      jest.mock('./environment', () => ({
        __ADHOC__: true,
        __DISTRIBUTION__: false,
        __E2E__: false,
        __STORYBOOK__: true,
        __TEST__: true,
        __DEV__: false,
        __PRODUCTION__: false,
      }));

      const {getBuildExtension} = require('./build');

      const result = getBuildExtension();
      const expected = 'BuildEnvironment test; BuildType adhoc; BuildFlavor storybook';

      expect(result).toEqual(expected);
    });
  });

  describe('getUserAgent', () => {
    const expectedBuildExtension = 'BuildEnvironment production; BuildType distribution';

    it('should get iOS user agent', async () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: true,
        __E2E__: false,
        __STORYBOOK__: false,
        __TEST__: false,
        __DEV__: false,
        __PRODUCTION__: true,
      }));

      const {getUserAgent} = require('./build');

      const result = await getUserAgent();
      const expected = `Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2; ${expectedBuildExtension})`;

      expect(result).toEqual(expected);
    });

    it('should get Android user agent', async () => {
      jest.mock('./environment', () => ({
        __ADHOC__: false,
        __DISTRIBUTION__: true,
        __E2E__: false,
        __STORYBOOK__: false,
        __TEST__: false,
        __DEV__: false,
        __PRODUCTION__: true,
      }));

      jest.mock('react-native-device-info', () => ({
        getBrand: jest.fn(() => Promise.resolve('Samsung')),
        getModel: jest.fn(() => Promise.resolve('SM-9000')),
        getSystemVersion: jest.fn(() => Promise.resolve('1.2.3')),
      }));

      jest.mock('react-native', () => ({
        Platform: {
          OS: 'android',
        },
      }));

      const {getUserAgent} = require('./build');

      const result = await getUserAgent();
      const expected = `Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Dalvik/2.1.0 (Linux; Samsung SM-9000; Android 1.2.3; ${expectedBuildExtension})`;

      expect(result).toEqual(expected);
    });
  });
});
