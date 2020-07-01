import {createProgression} from '../__fixtures__/progression';
import {CONTENT_TYPE, ENGINE} from '../const';
import createService from './analytics';

jest.mock('@react-native-firebase/app', () => ({
  utils: jest.fn(() => ({})),
}));
jest.mock('@react-native-firebase/analytics', () => jest.fn());

describe('Analytics', () => {
  it('sendViewedMediaAnalytics', () => {
    const logEvent = jest.fn();
    // @ts-ignore
    const service = createService({logEvent});
    // @ts-ignore
    service.sendViewedMediaAnalytics({type: 'foobar'}, 'baz');
    expect(logEvent).toHaveBeenCalledWith('mediaViewed', {mediaType: 'foobar', location: 'baz'});
  });

  describe('sendProgressionFinished', () => {
    it('without progression', () => {
      const logEvent = jest.fn();
      // @ts-ignore
      const service = createService({logEvent});
      // @ts-ignore
      service.sendProgressionFinished({});
      expect(logEvent).not.toHaveBeenCalled();
    });

    it('with progression and engineConfig', () => {
      // @ts-ignore
      const progression = createProgression({
        engine: ENGINE.LEARNER,
        state: {nextContent: {type: CONTENT_TYPE.FAILURE, ref: 'foobar'}},
      });
      const logEvent = jest.fn();
      // @ts-ignore
      const service = createService({logEvent});
      // @ts-ignore
      service.sendProgressionFinished(progression, {remainingLifeRequests: 1});
      expect(logEvent).toHaveBeenCalledWith('finishProgression', {
        type: ENGINE.LEARNER,
        state: CONTENT_TYPE.FAILURE,
        extraLife: 0,
      });
    });
  });

  it('logEvent', () => {
    const logEvent = jest.fn();
    // @ts-ignore
    const service = createService({logEvent});
    // @ts-ignore this is a fake event
    service.logEvent('foo', {bar: 'baz'});
    expect(logEvent).toHaveBeenCalledWith('foo', {bar: 'baz'});
  });
});
