import {edit, fetch, EDIT, FETCH} from './search';
import type {Action} from './search';

describe('search', () => {
  describe('edit', () => {
    it('should return the action with the text', () => {
      const payload = {text: 'foo'};

      const result = edit(payload);
      const expected: Action = {
        type: EDIT,
        payload,
      };

      expect(result).toEqual(expected);
    });

    it('should return the action with the object', () => {
      const payload = {params: {theme: 'bar'}};

      const result = edit(payload);
      const expected: Action = {
        type: EDIT,
        payload,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('fetch', () => {
    it('should return the action with the payload (true)', () => {
      const payload = true;

      const result = fetch(payload);
      const expected: Action = {
        type: FETCH,
        payload,
      };

      expect(result).toEqual(expected);
    });

    it('should return the action with the payload (false)', () => {
      const payload = false;

      const result = fetch(payload);
      const expected: Action = {
        type: FETCH,
        payload,
      };

      expect(result).toEqual(expected);
    });
  });
});
