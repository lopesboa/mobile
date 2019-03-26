// @flow

import {find, getNextLevel} from './recommendations';

describe('Recommendation data layer', () => {
  describe('find', () => {
    it('should be mocked', async () => {
      const actual = await find('type', 'ref');
      expect(actual).toEqual([]);
    });
  });
  describe('getNextLevel', () => {
    it('should be mocked', async () => {
      const actual = await getNextLevel('ref');
      expect(actual).toBeUndefined();
    });
  });
});
