import {getCleanUri, buildUrlQueryParams, getQueryParamsFromURL} from './uri';

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

  describe('buildUrlQueryParams', () => {
    it('should return the given params in a query params format', () => {
      const params = {
        type: 'cards',
        offset: 2,
        disabled: true,
      };
      const expectedResult = `type=${params.type}&offset=${params.offset}&disabled=true`;
      expect(buildUrlQueryParams(params)).toBe(expectedResult);
    });
  });

  describe('getQueryParamsFromURL', () => {
    it('should return an empty object if there are no querystring params in the string', () => {
      expect(getQueryParamsFromURL('https://batman-staging.coorpacademy.com/')).toEqual({});
    });
    it('should return an object with the query params parsed from a link', () => {
      const expectedResult = {
        theme: 'them_VkFqE1FII',
        author: 'coorpacademy',
        type: 'course',
        foo: 'bar',
        hello: 'world',
      };
      expect(
        getQueryParamsFromURL(
          'https://batman-staging.coorpacademy.com/catalog?theme=them_VkFqE1FII&foo=bar&type=course&author=coorpacademy&hello=world',
        ),
      ).toEqual(expectedResult);
    });
  });
});
