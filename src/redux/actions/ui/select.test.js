// @flow

import {focus, blur, FOCUS, BLUR} from './select';
import type {Action} from './select';

describe('select', () => {
  describe('focus', () => {
    it('should return an action without the select.key focused', () => {
      const payload = 'foo';

      const result = focus(payload);
      const expected: Action = {
        type: FOCUS,
        payload
      };

      expect(result).toEqual(expected);
    });
  });

  describe('blur', () => {
    it('should return the action', () => {
      const action = blur();
      expect(action).toEqual({
        type: BLUR
      });
    });
  });
});
