// @flow strict

import {ENGINE, CONTENT_TYPE} from '../const';
import createService from './progressions';

describe('Progression service', () => {
  it('shoud return mocked best score on content', async () => {
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
});
