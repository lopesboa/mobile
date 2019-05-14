// @flow strict

import theme, {getHitSlop} from './theme';

describe('Theme', () => {
  describe('getHitSlop', () => {
    it('should return a small hitslop', () => {
      const result = getHitSlop();
      const expected: HitSlop = {
        left: theme.spacing.small,
        top: theme.spacing.small,
        right: theme.spacing.small,
        bottom: theme.spacing.small
      };

      expect(result).toEqual(expected);
    });

    it('should return a custom hitslop', () => {
      const result = getHitSlop('large');
      const expected: HitSlop = {
        left: theme.spacing.large,
        top: theme.spacing.large,
        right: theme.spacing.large,
        bottom: theme.spacing.large
      };

      expect(result).toEqual(expected);
    });
  });
});
