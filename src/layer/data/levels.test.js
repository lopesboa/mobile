// @flow strict

import {mapToLevelAPIExpectedResult} from './mappers.test';

import {findById} from './levels';

jest.mock('./core', () => {
  const {discipline4kEB1WE5r} = require('../../__fixtures__/discipline');
  const levels = discipline4kEB1WE5r.modules;
  return {
    getItem: () => Promise.resolve(levels[0])
  };
});

describe('levels', () => {
  it('should return all the levels', async () => {
    const result = await findById('en')('yolo');
    expect(result).toEqual(mapToLevelAPIExpectedResult);
  });
});
