// @flow strict

import {findByChapter, findById} from './slides';

import {mapToSlideAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const fixtures = require('../../__fixtures__/slides');
  return {
    getItem: () => Promise.resolve(fixtures.slide_sli_415pDBG2r),
    getItemsPerResourceType: () => Promise.resolve([fixtures.slide_sli_415pDBG2r])
  };
});

describe('slide', () => {
  it('should find the slides given a chapter id', async () => {
    const result = await findByChapter('en')('cha_4yiDgZ4cH');
    expect(result).toEqual([mapToSlideAPIExpectedResult]);
  });

  it('should find the slides given id', async () => {
    const result = await findById('en')('dummyId');
    expect(result).toEqual(mapToSlideAPIExpectedResult);
  });
});
