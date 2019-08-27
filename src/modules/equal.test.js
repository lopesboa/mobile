// @flow strict

describe('Compare', () => {
  describe('isEqual', () => {
    it('should return true', () => {
      const isEqual = require('./equal').default;
      const props = {
        foo: 'bar',
        baz: {
          qux: 'quux'
        }
      };
      const nextProps = {
        foo: 'bar',
        baz: {
          qux: 'quux'
        }
      };
      const result = isEqual(props, nextProps);
      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const isEqual = require('./equal').default;
      const props = {
        foo: 'bar',
        baz: {
          qux: 'quux'
        }
      };
      const nextProps = {
        foo: 'bar',
        baz: {
          qux: 'quuux'
        }
      };
      const result = isEqual(props, nextProps);
      expect(result).toBeFalsy();
    });
  });
});
