// @flow strict

describe('environment', () => {
  describe('__E2E__', () => {
    it('should return false', () => {
      const {__E2E__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      process.env.REACT_NATIVE_FLAVOR = 'E2E';
      const {__E2E__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    afterEach(() => {
      delete process.env.REACT_NATIVE_FLAVOR;
    });
  });

  describe('__STORYBOOK__', () => {
    it('should return false', () => {
      const {__STORYBOOK__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      process.env.REACT_NATIVE_FLAVOR = 'STORYBOOK';
      const {__STORYBOOK__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    afterEach(() => {
      delete process.env.REACT_NATIVE_FLAVOR;
    });
  });
});
