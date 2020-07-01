import {fakeError} from '../../utils/tests';
import {createToken} from '../../__fixtures__/tokens';
import {createSections} from '../../__fixtures__/sections';
import type {Section} from '../../types';

const sections = createSections();
const token = createToken({});

describe('sections', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('fetchSections', () => {
    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true,
      }));
      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 0, 3);
      const expected = {total: sections.length, sections: sections.slice(0, 3)};
      return expect(actual).resolves.toEqual(expected);
    });

    it('should fetch from host', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce(
        (
          url,
          options,
        ): Promise<{
          json: () => Promise<{
            search_meta: {
              total: number;
            };
            hits: Array<Section>;
          }>;
        }> => {
          expect(url).toBe(
            'https://domain.tld/api/v2/sections?type=cards&offset=1&limit=2&lang=en',
          );
          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () =>
              Promise.resolve({
                search_meta: {
                  total: sections.length,
                },
                hits: sections.slice(1, 2),
              }),
          });
        },
      );

      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 1, 2);
      const expected = {total: sections.length, sections: sections.slice(1, 2)};
      return expect(actual).resolves.toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 2, 3);

      return expect(actual).rejects.toThrow(fakeError);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
