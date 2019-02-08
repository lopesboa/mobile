// @flow strict

import {mapToChapterAPIExpectedResult} from './mappers.test';
import {find, findById} from './chapters';

jest.mock('./core', () => {
  const fixtures = require('../../__fixtures__/chapters');
  const chapters = [fixtures.chapter_4yiDgZ4cH];
  return {
    getItemsPerResourceType: () => Promise.resolve(chapters),
    getItem: () => Promise.resolve(fixtures.chapter_4yiDgZ4cH)
  };
});

describe('chapters', () => {
  it('should return all the chapters', async () => {
    const result = await find('en')();
    expect(result).toEqual([mapToChapterAPIExpectedResult]);
  });

  it('should return all the chapters', async () => {
    const result = await findById('en')('dummyId');
    expect(result).toEqual(mapToChapterAPIExpectedResult);
  });
});
