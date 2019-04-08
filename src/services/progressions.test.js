// @flow strict

import {ENGINE, CONTENT_TYPE} from '../const';

jest.mock('@coorpacademy/player-services', () => ({
  Progressions: jest.fn()
}));

describe('Progression service', () => {
  it('shoud return mocked best score on content', async () => {
    const createService = require('./progressions').default;
    // $FlowFixMe
    const service = createService({findBestOf: () => Promise.resolve({stars: 20})});
    const {stars} = await service.findBestOf(
      ENGINE.LEARNER,
      CONTENT_TYPE.LEVEL,
      'mod_1',
      'prog_id'
    );
    expect(stars).toEqual({stars: 20});
  });

  it('should create a progression', async () => {
    const logEvent = jest.fn();
    const {Progressions} = require('@coorpacademy/player-services');
    const create = jest.fn();
    Progressions.mockImplementation(() => ({
      create
    }));
    const createService = require('./progressions').default;
    // $FlowFixMe
    const service = createService({logEvent});
    const ref = 'foobar';
    const engine = {ref: 'bar', version: 'v1'};
    const content = {ref: 'qux', type: CONTENT_TYPE.CHAPTER};
    const config = {version: 'v1'};
    await service.create(ref, engine, content, config);
    expect(logEvent).toHaveBeenCalledWith('startProgression', {
      type: 'Bar'
    });
    expect(create).toHaveBeenCalledWith(ref, engine, content, config);
  });
});
