// @flow strict

import {createProgression} from '../__fixtures__/progression';
import {CONTENT_TYPE, ENGINE} from '../const';
import createService from './analytics';

jest.mock('react-native-firebase', () => ({
  analytics: jest.fn(),
  utils: jest.fn(() => ({}))
}));

describe('Analytics', () => {
  it('sendViewedMediaAnalytics', () => {
    const logEvent = jest.fn();
    // $FlowFixMe
    const service = createService({logEvent});
    // $FlowFixMe
    service.sendViewedMediaAnalytics({type: 'foobar'}, 'baz');
    expect(logEvent).toHaveBeenCalledWith('mediaViewed', {mediaType: 'foobar', location: 'baz'});
  });

  describe('sendProgressionAnalytics', () => {
    it('without progression', () => {
      const logEvent = jest.fn();
      // $FlowFixMe
      const service = createService({logEvent});
      // $FlowFixMe
      service.sendProgressionAnalytics({});
      expect(logEvent).not.toHaveBeenCalled();
    });

    it('with progression and not finished', () => {
      // $FlowFixMe
      const progression = createProgression({engine: 'learner', state: {}});
      const logEvent = jest.fn();
      // $FlowFixMe
      const service = createService({logEvent});
      // $FlowFixMe
      service.sendProgressionAnalytics(progression);
      expect(logEvent).not.toHaveBeenCalled();
    });

    it('with progression and finished', () => {
      // $FlowFixMe
      const progression = createProgression({
        engine: ENGINE.LEARNER,
        state: {nextContent: {type: CONTENT_TYPE.FAILURE, ref: 'foobar'}}
      });
      const logEvent = jest.fn();
      // $FlowFixMe
      const service = createService({logEvent});
      // $FlowFixMe
      service.sendProgressionAnalytics(progression, {remainingLifeRequests: 1});
      expect(logEvent).toHaveBeenCalledWith('finishProgression', {
        type: ENGINE.LEARNER,
        state: CONTENT_TYPE.FAILURE,
        extraLife: 0
      });
    });
  });

  it('logEvent', () => {
    const logEvent = jest.fn();
    // $FlowFixMe
    const service = createService({logEvent});
    // $FlowFixMe this is a fake event
    service.logEvent('foo', {bar: 'baz'});
    expect(logEvent).toHaveBeenCalledWith('foo', {bar: 'baz'});
  });

  it('setCurrentScreen', () => {
    const setCurrentScreen = jest.fn();
    // $FlowFixMe
    const service = createService({setCurrentScreen});
    service.setCurrentScreen('qux');
    expect(setCurrentScreen).toHaveBeenCalledWith('qux');
  });
});
