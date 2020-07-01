import {ANALYTICS_EVENT_TYPE} from '../../const';

const createAnalytics = () => ({
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: jest.fn(),
  setCurrentScreen: jest.fn(),
  setUserProperties: jest.fn(),
});

describe('Analytics', () => {
  it('setAnalyticsCollectionEnabled', () => {
    const analytics = createAnalytics();
    jest.mock('@react-native-firebase/app', () => ({
      utils: jest.fn(() => ({})),
    }));
    jest.mock('@react-native-firebase/analytics', () => jest.fn());

    const firebaseAnalytics = require('@react-native-firebase/analytics');
    // @ts-ignore package is mocked
    firebaseAnalytics.mockReturnValue(analytics);
    require('./analytics');
    expect(analytics.setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true);
  });

  describe('logEvent', () => {
    describe(ANALYTICS_EVENT_TYPE.NAVIGATE, () => {
      it('should set current screen', () => {
        const analytics = createAnalytics();
        jest.mock('@react-native-firebase/app', () => ({
          utils: jest.fn(() => ({})),
        }));
        jest.mock('@react-native-firebase/analytics', () => jest.fn());

        const firebaseAnalytics = require('@react-native-firebase/analytics');
        // @ts-ignore package is mocked
        firebaseAnalytics.mockReturnValue(analytics);
        const {logEvent} = require('./analytics');
        // @ts-ignore this is a fake event
        logEvent(ANALYTICS_EVENT_TYPE.NAVIGATE, {screenName: 'qux'});
        expect(analytics.setUserProperties).not.toHaveBeenCalled();
        expect(analytics.setCurrentScreen).toHaveBeenCalledWith('qux');
        expect(analytics.logEvent).not.toHaveBeenCalled();
      });
    });

    describe(ANALYTICS_EVENT_TYPE.SIGN_IN, () => {
      it('should set user properties', () => {
        const analytics = createAnalytics();
        jest.mock('@react-native-firebase/app', () => ({
          utils: jest.fn(() => ({})),
        }));
        jest.mock('@react-native-firebase/analytics', () => jest.fn());

        const firebaseAnalytics = require('@react-native-firebase/analytics');
        // @ts-ignore package is mocked
        firebaseAnalytics.mockReturnValue(analytics);
        const {logEvent} = require('./analytics');
        // @ts-ignore this is a fake event
        logEvent(ANALYTICS_EVENT_TYPE.SIGN_IN, {userId: 'foo', brand: 'bar'});
        expect(analytics.setUserProperties).toHaveBeenCalledWith({
          userId: 'foo',
          brand: 'bar',
        });
        expect(analytics.setCurrentScreen).not.toHaveBeenCalled();
        expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.SIGN_IN, {
          userId: 'foo',
          brand: 'bar',
        });
      });
    });

    describe(ANALYTICS_EVENT_TYPE.SIGN_OUT, () => {
      it('should unset user properties', () => {
        const analytics = createAnalytics();
        jest.mock('@react-native-firebase/app', () => ({
          utils: jest.fn(() => ({})),
        }));
        jest.mock('@react-native-firebase/analytics', () => jest.fn());

        const firebaseAnalytics = require('@react-native-firebase/analytics');
        // @ts-ignore package is mocked
        firebaseAnalytics.mockReturnValue(analytics);
        const {logEvent} = require('./analytics');
        // @ts-ignore this is a fake event
        logEvent(ANALYTICS_EVENT_TYPE.SIGN_OUT, {userId: 'foo', brand: 'bar'});
        expect(analytics.setUserProperties).toHaveBeenCalledWith({
          userId: null,
          brand: null,
        });
        expect(analytics.setCurrentScreen).not.toHaveBeenCalled();
        expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.SIGN_OUT, {
          userId: 'foo',
          brand: 'bar',
        });
      });
    });

    it('should handle common event', () => {
      const analytics = createAnalytics();
      jest.mock('@react-native-firebase/app', () => ({
        utils: jest.fn(() => ({})),
      }));
      jest.mock('@react-native-firebase/analytics', () => jest.fn());

      const firebaseAnalytics = require('@react-native-firebase/analytics');
      // @ts-ignore package is mocked
      firebaseAnalytics.mockReturnValue(analytics);
      const {logEvent} = require('./analytics');
      // @ts-ignore this is a fake event
      logEvent('foo', {bar: 'baz'});
      expect(analytics.setUserProperties).not.toHaveBeenCalled();
      expect(analytics.setCurrentScreen).not.toHaveBeenCalled();
      expect(analytics.logEvent).toHaveBeenCalledWith('foo', {bar: 'baz'});
    });
  });
});
