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

  it('it should throw a generic error', async () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=baz');
      const response = new Response(null, {
        status: 400
      });
      throw response;
    });

    const fetch = require('./fetch').default;

    let result;
    try {
      result = await fetch('https://domain.tld?foo=baz');
    } catch (e) {
      expect(e).toBeInstanceOf(Response);
      expect(e).not.toBeInstanceOf(ForbiddenError);
      expect(e).not.toHaveProperty('name', 'ForbiddenError');
    }

    expect(result).toBeUndefined();
  });

  it('should throw a ForbiddenError if 403 status code', async () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = new Response(null, {
        status: 403
      });

      throw response;
    });

    const fetch = require('./fetch').default;

    let result;
    try {
      result = await fetch('https://domain.tld?foo=qux');
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError);
      expect(e).toHaveProperty('name', 'ForbiddenError');
    }

    expect(result).toBeUndefined();
  });
});
