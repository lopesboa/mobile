// @flow strict

import {slide_sli_415pDBG2r} from '../../__fixtures__/slides';
import {getCorrectAnswer} from './answers';

jest.mock('./core', () => {
  const fixtures = require('../../__fixtures__/slides');
  return {
    getItem: () => Promise.resolve(fixtures.slide_sli_415pDBG2r)
  };
});

describe('answers', () => {
  it('should find the correct answers', async () => {
    const result = await getCorrectAnswer('en')(slide_sli_415pDBG2r.universalRef);
    const question = slide_sli_415pDBG2r.question;
    let expectedResult = undefined;
    if (question) {
      expectedResult = question.content.answers;
    }
    expect(result).toEqual(expectedResult);
  });
});
