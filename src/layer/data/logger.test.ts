const createCrashlytics = () => ({
  recordError: jest.fn(),
  setAttribute: jest.fn(),
});

describe('Logger', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('@react-native-firebase/crashlytics', () => jest.fn());

    jest.mock('../../modules/datadog', () => ({
      log: jest.fn(),
    }));

    jest.mock('../../utils/local-token', () => {
      const {createToken} = require('../../__fixtures__/tokens');
      return {
        get: jest.fn(() => Promise.resolve(createToken({}))),
      };
    });

    jest.mock('../../utils/local-brand', () => {
      const {createBrand} = require('../../__fixtures__/brands');
      return {
        get: jest.fn(() => Promise.resolve(createBrand({}))),
      };
    });
  });

  describe('logError', () => {
    it('should log error to firebase crashlytics and datadog', async () => {
      const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // @ts-ignore package is mocked
      firebaseCrashlytics.mockReturnValue(crashlytics);

      const error = new Error('Foo bar');
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {
        brand: 'mobile',
        platform: 'staging',
        userId: 'foobar',
      });
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(error);
    });

    it('should log error message if stack is not available', async () => {
      const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // @ts-ignore package is mocked
      firebaseCrashlytics.mockReturnValue(crashlytics);

      const error = new Error('Foo bar');
      error.stack = '';
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {
        brand: 'mobile',
        platform: 'staging',
        userId: 'foobar',
      });
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(error);
    });

    it('should log error even if user is anonymous', async () => {
      const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
      const {get: getBrand} = require('../../utils/local-brand');
      const {get: getToken} = require('../../utils/local-token');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // @ts-ignore package is mocked
      firebaseCrashlytics.mockReturnValue(crashlytics);

      // @ts-ignore mocked function
      getBrand.mockReturnValueOnce(null);
      // @ts-ignore mocked function
      getToken.mockReturnValueOnce(null);

      const error = new Error('Foo bar');
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {});
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(error);
    });
  });

  describe('setProperties', () => {
    it('should set properties', () => {
      const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
      const {setProperties} = require('./logger');

      const crashlytics = createCrashlytics();
      // @ts-ignore package is mocked
      firebaseCrashlytics.mockReturnValue(crashlytics);

      setProperties({foo: 'bar', baz: 'qux'});

      expect(crashlytics.setAttribute).toHaveBeenCalledTimes(2);
      expect(crashlytics.setAttribute).toHaveBeenCalledWith('foo', 'bar');
      expect(crashlytics.setAttribute).toHaveBeenCalledWith('baz', 'qux');
    });

    it('should reset properties', () => {
      const firebaseCrashlytics = require('@react-native-firebase/crashlytics');
      const {setProperties} = require('./logger');

      const crashlytics = createCrashlytics();
      // @ts-ignore package is mocked
      firebaseCrashlytics.mockReturnValue(crashlytics);

      setProperties({
        foo: null,
        baz: null,
      });

      expect(crashlytics.setAttribute).toHaveBeenCalledTimes(2);
      expect(crashlytics.setAttribute).toHaveBeenCalledWith('foo', '');
      expect(crashlytics.setAttribute).toHaveBeenCalledWith('baz', '');
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
