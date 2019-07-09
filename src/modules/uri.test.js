// @flow strict

import {getCleanUri, buildUrlQueryParams} from './uri';

describe('Uri', () => {
  const expected = 'https://domain.tld';

  it('should handle uri without protocol', () => {
    const result = getCleanUri('//domain.tld');
    expect(result).toEqual(expected);
  });

  it('should handle http uri', () => {
    const result = getCleanUri('http://domain.tld');
    expect(result).toEqual(expected);
  });

  it('should handle https uri', () => {
    const result = getCleanUri('https://domain.tld');
    expect(result).toEqual(expected);
  });

  describe('build query params', () => {
    it('should return the given params in a query params format', () => {
      const params = {
        type: 'cards',
        offset: 2
      };
      const expectedResult = `type=${params.type}&offset=${params.offset}`;
      expect(buildUrlQueryParams(params)).toBe(expectedResult);
    });
  });
});
