// @flow strict

import {qcm} from '../../__fixtures__/questions';
import {getCorrectAnswer} from './answers';

jest.mock('./core', () => {
  const slides = require('../../__fixtures__/slides');
  const {qcm: question} = require('../../__fixtures__/questions');

  return {
    getItem: () => Promise.resolve(slides.createSlide({ref: 'sli_1', chapterId: 'cha_1', question}))
  };
});

describe('answers', () => {
  it('should find the correct answers', async () => {
    const result = await getCorrectAnswer('en')('cha_1');
    const expectedResult = qcm.content.answers;
    expect(result).toEqual(expectedResult);
  });
});
