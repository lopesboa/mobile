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
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = {
        status: 403,
        json: () => ({
          err: ERROR_MESSAGE
        })
      };
      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    const result = fetch('https://domain.tld?foo=qux');

    expect(result).rejects.toThrow(ForbiddenError);
  });

  it('should not throw a ForbiddenError if 403 status code and error message doesnt match ', () => {
    const _fetch = require('cross-fetch');

    _fetch.mockImplementationOnce(url => {
      expect(url).toBe('https://domain.tld?foo=qux');
      const response = {
        status: 403,
        json: () => ({
          err: 'foo'
        })
      };
      return Promise.resolve(response);
    });

    const fetch = require('./fetch').default;

    const result = fetch('https://domain.tld?foo=qux');

    expect(result).rejects.toThrow('Action not allowed');
  });

  it('headers should have X-Requested-With by default', async () => {
    const _fetch = require('cross-fetch');

    const expectedHeader = {
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2; BuildEnvironment test)'
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

  it('should throw an error if called in end to end', async () => {
    jest.mock('./environment', () => ({
      __E2E__: true
    }));
    const _fetch = require('cross-fetch');
    const fetch = require('./fetch').default;

    const result = await fetch('https://domain.tld?foo=bar');

    expect(result).toEqual('Cannot be called from e2e mode');
    expect(_fetch).toHaveBeenCalledTimes(0);
  });
});
