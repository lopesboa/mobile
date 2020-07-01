import {findByChapter, findById} from './slides';

import {mapToSlideAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const questions = require('../../__fixtures__/questions');
  const question = questions.createQCM({});
  const lessons = require('../../__fixtures__/lessons');
  const lesson = lessons.createVideo({ref: 'les_1'});
  const slides = require('../../__fixtures__/slides');
  const slide = slides.createSlide({ref: 'sli_1', chapterId: 'cha_1', question, lessons: [lesson]});

  return {
    getItem: () => Promise.resolve(slide),
    getItemsPerResourceType: () => Promise.resolve([slide]),
  };
});

describe('slide', () => {
  it('should find the slides given a chapter id', async () => {
    const result = await findByChapter('cha_1');
    expect(result).toEqual([mapToSlideAPIExpectedResult]);
  });

  it('should find the slides given id', async () => {
    const result = await findById('dummyId');
    expect(result).toEqual(mapToSlideAPIExpectedResult);
  });
});
