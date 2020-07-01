import {createQCM} from '../../__fixtures__/questions';
import {getCorrectAnswer} from './answers';

const qcm = createQCM({});

jest.mock('./core', () => {
  const slides = require('../../__fixtures__/slides');
  const questions = require('../../__fixtures__/questions');
  const question = questions.createQCM({});

  return {
    getItem: () =>
      Promise.resolve(slides.createSlide({ref: 'sli_1', chapterId: 'cha_1', question})),
  };
});

describe('answers', () => {
  it('should find the correct answers', async () => {
    const result = await getCorrectAnswer('cha_1');
    const expectedResult = qcm.content.answers;
    expect(result).toEqual(expectedResult);
  });
});
