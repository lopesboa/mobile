// @flow strict

import {clearSearch, CLEAR_SEARCH} from './clear';
import type {Action} from './clear';

describe('Cards', () => {
  describe('clearSearch', () => {
    it('should get the action', () => {
      const result = clearSearch();
      const expected: Action = {
        type: CLEAR_SEARCH
      };

      expect(result).toEqual(expected);
    });
  });
});
