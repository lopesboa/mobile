// @flow strict

const createCrashlytics = () => ({
  recordError: jest.fn(),
  setStringValue: jest.fn()
});

describe('Logger', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('logError', () => {
    it('should log error to firebase crashlytics', () => {
      jest.mock('react-native-firebase', () => ({
        crashlytics: jest.fn()
      }));

      const firebase = require('react-native-firebase');
      const {logError} = require('./logger');

      const crashlytics = createCrashlytics();
      // $FlowFixMe package is mocked
      firebase.crashlytics.mockReturnValue(crashlytics);

      const error = new Error('Foo bar');
      logError(error);

      expect(crashlytics.recordError).toHaveBeenCalledTimes(1);
      expect(crashlytics.recordError).toHaveBeenCalledWith(0, error.stack);
    });
  });

  describe('setProperties', () => {
    it('should set properties', () => {
      jest.mock('react-native-firebase', () => ({
        crashlytics: jest.fn()
      }));

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
      jest.mock('react-native-firebase', () => ({
        crashlytics: jest.fn()
      }));

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
    jest.resetModules();
  });
});
