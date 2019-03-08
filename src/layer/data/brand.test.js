// @flow strict

import {createBrand} from '../../__fixtures__/brands';
import type {JWT, Config} from './brand';

const brand = createBrand();
const jwt: JWT = {
  host: brand.host
};
const token = ['', Buffer.from(JSON.stringify(jwt)).toString('base64')].join('.');

describe('brand', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('fetchBrand', () => {
    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchBrand} = require('./brand');
      const actual = fetchBrand(token);
      const expected = brand;
      return expect(actual).resolves.toEqual(expected);
    });

    it('should fetch config and return brand', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options): Promise<{
        json: () => Promise<Config>
      }> => {
        expect(url).toBe(`${brand.host}/config`);

        expect(options).toHaveProperty('headers.authorization', token);

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              brand: {
                name: 'mobile',
                baseUrl: 'https://mobile-staging.coorpacademy.com',
                contentCategoryName: 'Mobile'
              },
              themes: [
                {
                  common: {
                    primary: '#00B0FF'
                  },
                  images: {
                    'logo-mobile':
                      'https://static.coorpacademy.com/content/7steps/raw/logo_loreal-1500561107159.svg'
                  }
                }
              ]
            })
        });
      });

      const {fetchBrand} = require('./brand');
      const actual = fetchBrand(token);
      const expected = brand;
      return expect(actual).resolves.toEqual(expected);
    });
    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(new Error()));

      const {fetchBrand} = require('./brand');
      const actual = fetchBrand(token);

      return expect(actual).rejects.toThrow();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
