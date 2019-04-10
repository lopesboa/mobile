// @flow strict

jest.mock('react-native-firebase', () => ({
  analytics: jest.fn(),
  utils: jest.fn(() => ({}))
}));

const firebase = require('react-native-firebase');

const createAnalytics = () => ({
  setAnalyticsCollectionEnabled: jest.fn(),
  logEvent: jest.fn(),
  setCurrentScreen: jest.fn(),
  setUserProperty: jest.fn()
});

describe('Analytics', () => {
  it('setAnalyticsCollectionEnabled', () => {
    const analytics = createAnalytics();
    // $FlowFixMe package is mocked
    firebase.analytics.mockReturnValueOnce(analytics);
    require('./analytics');
    expect(analytics.setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true);
  });

  it('logEvent', () => {
    const analytics = createAnalytics();
    // $FlowFixMe package is mocked
    firebase.analytics.mockReturnValueOnce(analytics);
    const {logEvent} = require('./analytics');
    // $FlowFixMe this is a fake event
    logEvent('foo', {bar: 'baz'});
    expect(analytics.logEvent).toHaveBeenCalledWith('foo', {bar: 'baz'});
  });

  it('setCurrentScreen', () => {
    const analytics = createAnalytics();
    // $FlowFixMe package is mocked
    firebase.analytics.mockReturnValueOnce(analytics);
    const {setCurrentScreen} = require('./analytics');
    setCurrentScreen('qux');
    expect(analytics.setCurrentScreen).toHaveBeenCalledWith('qux');
  });

  it('setUserProperty', () => {
    const analytics = createAnalytics();
    // $FlowFixMe package is mocked
    firebase.analytics.mockReturnValueOnce(analytics);
    const {setUserProperty} = require('./analytics');
    setUserProperty('id', 'bar');
    expect(analytics.setUserProperty).toHaveBeenCalledWith('id', 'bar');
  });
});
