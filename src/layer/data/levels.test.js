// @flow strict

import {mapToLevelAPIExpectedResult} from './mappers.test';

import {findById} from './levels';

jest.mock('./core', () => {
  const levels = require('../../__fixtures__/levels');
  const level = levels.createLevel({ref: 'mod_1', chapterIds: ['cha_1']});

  return {
    getItem: () => Promise.resolve(level)
  };
});

describe('levels', () => {
  it('should return all the levels', async () => {
    const result = await findById('en')('yolo');
    expect(result).toEqual(mapToLevelAPIExpectedResult);
  });
});
