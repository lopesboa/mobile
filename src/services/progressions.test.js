// @flow strict

import {ENGINE, CONTENT_TYPE} from '../const';
import createService from './progressions';

describe('Progression service', () => {
  it('shoud return mocked best score on content', async () => {
    // $FlowFixMe
    const service = createService({});
    const bestOf = await service.findBestOf(ENGINE.LEARNER, CONTENT_TYPE.LEVEL, 'mod_1', 'prog_id');
    expect(bestOf).toEqual({stars: 0});
  });
});
