// @flow strict

const createCrashlytics = () => ({
  recordError: jest.fn(),
  setStringValue: jest.fn()
});

describe('Logger', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('react-native-firebase', () => ({
      crashlytics: jest.fn()
    }));

    jest.mock('../../modules/datadog', () => ({
      log: jest.fn()
    }));

    jest.mock('../../utils/local-token', () => {
      const {createToken} = require('../../__fixtures__/tokens');
      return {
        get: jest.fn(() => Promise.resolve(createToken({})))
      };
    });

    jest.mock('../../utils/local-brand', () => {
      const {createBrand} = require('../../__fixtures__/brands');
      return {
        get: jest.fn(() => Promise.resolve(createBrand({})))
      };
    });
  });

  describe('logError', () => {
    it('should log error to firebase crashlytics and datadog', async () => {
      const firebase = require('react-native-firebase');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      const error = new Error('Foo bar');
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {
        brand: 'mobile',
        platform: 'staging',
        userId: 'foobar'
      });
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(0, error.stack);
    });

    it('should log error message if stack is not available', async () => {
      const firebase = require('react-native-firebase');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      const error = new Error('Foo bar');
      error.stack = '';
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {
        brand: 'mobile',
        platform: 'staging',
        userId: 'foobar'
      });
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(0, error.message);
    });

    it('should log error even if user is anonymous', async () => {
      const firebase = require('react-native-firebase');
      const {get: getBrand} = require('../../utils/local-brand');
      const {get: getToken} = require('../../utils/local-token');
      const {log: logDatadogError} = require('../../modules/datadog');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      // $FlowFixMe mocked function
      getBrand.mockReturnValueOnce(null);
      // $FlowFixMe mocked function
      getToken.mockReturnValueOnce(null);

      const error = new Error('Foo bar');
      await logError(error);

      expect(logDatadogError).toHaveBeenCalledTimes(1);
      expect(logDatadogError).toHaveBeenCalledWith(error, {});
      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(0, error.stack);
    });
  });

  describe('setProperties', () => {
    it('should set properties', () => {
      const firebase = require('react-native-firebase');
      const {setProperties} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      setProperties({foo: 'bar', baz: 'qux'});

      expect(crashlytics.setStringValue).toHaveBeenCalledTimes(2);
      expect(crashlytics.setStringValue).toHaveBeenCalledWith('foo', 'bar');
      expect(crashlytics.setStringValue).toHaveBeenCalledWith('baz', 'qux');
    });

    it('should reset properties', () => {
      const firebase = require('react-native-firebase');
      const {setProperties} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      setProperties({
        foo: null,
        baz: null
      });

      expect(crashlytics.setStringValue).toHaveBeenCalledTimes(2);
      expect(crashlytics.setStringValue).toHaveBeenCalledWith('foo', '');
      expect(crashlytics.setStringValue).toHaveBeenCalledWith('baz', '');
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
