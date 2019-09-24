// @flow

import {Response} from 'node-fetch';

import {ForbiddenError} from '../models/error';
import {ERROR_MESSAGE} from './fetch';

describe('Fetch', () => {
  beforeEach(async () => {
    await jest.resetModules();
  });

  afterAll(async () => {
    await jest.resetAllMocks();
  });
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

  it('should throw a regular error if 403 status ', () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = {status: 403, json: () => {}};
      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    const result = fetch('https://domain.tld?foo=qux');

    expect(result).rejects.toThrow(Error);
  });

  it('should throw a ForbiddenError if 403 status code and error message match ', () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = {
        status: 403,
        json: () => {
          return {
            err: ERROR_MESSAGE
          };
        }
      };
      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    const result = fetch('https://domain.tld?foo=qux');

    expect(result).rejects.toThrow(ForbiddenError);
  });

  it('headers should have X-Requested-With by default', async () => {
    jest.mock('cross-fetch');
    const _fetch = require('cross-fetch');

    const expectedHeader = {
      'X-Requested-With': 'XMLHttpRequest'
    };

    const response = new Response();

    _fetch.mockImplementationOnce((url, options) => {
      expect(url).toBe('https://domain.tld?foo=qux');
      expect(options).toEqual({headers: expectedHeader, method: 'POST'});

      return Promise.resolve(response);
    });
    const fetch = require('./fetch').default;
    const result = await fetch('https://domain.tld?foo=qux', {method: 'POST'});
    expect(result).toEqual(response);
  });
});
