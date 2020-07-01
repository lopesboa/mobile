import {createToken} from '../../__fixtures__/tokens';
import {createBrand} from '../../__fixtures__/brands';
import type {Config} from './brand';

const brand = createBrand({});
const token = createToken({host: brand.host});

describe('brand', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('fetchBrand', () => {
    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true,
      }));

      const {fetchBrand} = require('./brand');
      const actual = fetchBrand(token);
      const expected = brand;

      return expect(actual).resolves.toEqual(expected);
    });

    it('should fetch config and return brand', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce(
        (
          url,
          options,
        ): Promise<{
          json: () => Promise<Config>;
        }> => {
          expect(url).toBe(`${brand.host}/config`);

          expect(options).toHaveProperty('headers.authorization', token);

          const result: Config = {
            brand: {
              name: 'mobile',
              baseUrl: 'https://mobile-staging.coorpacademy.com',
              contentCategoryName: 'Mobile',
            },
            slider: {
              start: {
                image:
                  'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
              },
            },
            defaultLanguage: 'en',
            supportedLngs: ['fr', 'de', 'it', 'zh'],
            themes: [
              {
                common: {
                  primary: '#00B0FF',
                },
                images: {
                  'logo-mobile':
                    'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
                },
              },
            ],
            youtube: {
              apiKey: '7Hi5iS4f4k34P1K3Y',
            },
            progressionEngine: {
              versions: {
                learner: '2',
                microlearning: '2',
              },
            },
            env: 'staging',
          };

          return Promise.resolve({
            json: () => Promise.resolve(result),
          });
        },
      );

      const {fetchBrand} = require('./brand');

      const actual = fetchBrand(token);
      const expected = brand;

      return expect(actual).resolves.toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
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
