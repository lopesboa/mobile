// @flow strict

import {toJWT} from '../../utils/tests';
import {createSections} from '../../__fixtures__/sections';
import type {JWT, Section} from '../../types';

const sections = createSections();
const jwt: JWT = {
  host: 'host',
  user: 'plop',
  iss: 'plip',
  grants: {mooc: 'foo'},
  exp: 1,
  iat: 1,
  usage: 'ploup'
};

const token = toJWT(jwt);

describe('sections', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('fetchSections', () => {
    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 0, 3);
      const expected = {total: sections.length, sections: sections.slice(0, 3)};
      return expect(actual).resolves.toEqual(expected);
    });

    it('should fetch from host', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce(
        (
          url,
          options
        ): Promise<{
          json: () => Promise<{|
            search_meta: {
              total: number
            },
            hits: Array<Section>
          |}>
        }> => {
          expect(url).toBe('host/api/v2/sections?offset=1&limit=2&type=cards');
          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () =>
              Promise.resolve({
                search_meta: {
                  total: sections.length
                },
                hits: sections.slice(1, 2)
              })
          });
        }
      );

      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 1, 2);
      const expected = {total: sections.length, sections: sections.slice(1, 2)};
      return expect(actual).resolves.toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(new Error()));

      const {fetchSections} = require('./sections');
      const actual = fetchSections(token, 2, 3);

      return expect(actual).rejects.toThrow();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
