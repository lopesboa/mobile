// @flow strict

import {createQCM} from '../../__fixtures__/questions';
import {createSlide} from '../../__fixtures__/slides';
import {fakeError} from '../../utils/tests';
import {getClue} from './clues';

const qcm = createQCM({});

jest.mock('./core', () => {
  const utils = require('../../utils/tests');
  const questions = require('../../__fixtures__/questions');
  const question = questions.createQCM({});
  const slides = require('../../__fixtures__/slides');
  const slide = slides.createSlide({ref: 'sli_1', chapterId: 'cha_1', question});

  return {
    fetchDisciplineBundle: () => {
      // Dunno why we need this function only in this file
      return Promise.reject(utils.fakeError);
    },
    getItem: (type, ref) => {
      if (ref === 'ref_exception') {
        return Promise.reject(utils.fakeError);
      }
      return Promise.resolve({
        ...slide,
        clue: ref === 'ref_withclue' ? slide.clue : undefined
      });
    }
  };
});

describe('clue', () => {
  describe('getClue', () => {
    it('should not find the clue for a given slide universalRef', async () => {
      const result = await getClue('en')('ref_withoutclue');
      expect(result).toBeUndefined();
    });

    it('should find the clue for a given slide universalRef', async () => {
      const slide = createSlide({ref: 'sli_1', chapterId: 'cha_1', question: qcm});
      const result = await getClue('en')('ref_withclue');
      expect(result).toEqual(slide.clue);
    });

    it('should handle exception', () => {
      const result = getClue('en')('ref_exception');
      expect(result).rejects.toThrow(fakeError);
    });
  });
});
