// @flow strict

import {slide_sli_415pDBG2r} from '../../__fixtures__/slides';
import {fakeError} from '../../utils/tests';
import {getClue} from './clues';

jest.mock('./core', () => {
  const fixtures = require('../../__fixtures__/slides');
  const utils = require('../../utils/tests');

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
        ...fixtures.slide_sli_415pDBG2r,
        clue: ref === 'ref_withclue' ? fixtures.slide_sli_415pDBG2r.clue : undefined
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
      const result = await getClue('en')('ref_withclue');
      expect(result).toEqual(slide_sli_415pDBG2r.clue);
    });

    it('should handle exception', () => {
      const result = getClue('en')('ref_exception');
      expect(result).rejects.toThrow(fakeError);
    });
  });
});
