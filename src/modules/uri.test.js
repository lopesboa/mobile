// @flow

import {getCleanUri} from './uri';

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
});
