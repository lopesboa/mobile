// @flow strict

import {mapToChapterAPIExpectedResult} from './mappers.test';
import {find, findById} from './chapters';

jest.mock('./core', () => {
  const chapters = require('../../__fixtures__/chapters');
  const chapter = chapters.createChapter({ref: 'cha_1', name: 'Fake chapter'});

  return {
    getItemsPerResourceType: () => Promise.resolve([chapter]),
    getItem: () => Promise.resolve(chapter)
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
