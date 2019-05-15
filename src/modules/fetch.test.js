// @flow

import {Response} from 'node-fetch';

import {ForbiddenError} from '../models/error';

describe('Fetch', () => {
  it('should return response if succeed', async () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');
    const response = new Response();

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=bar');

      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    const result = await fetch('https://domain.tld?foo=bar');

    expect(result).toEqual(response);
  });

  it('should throw a ForbiddenError if 403 status code', async () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = new Response({status: 403});
      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    try {
      await fetch('https://domain.tld?foo=qux');
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError);
    }
  });
});
