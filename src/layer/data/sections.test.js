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
      const actual = fetchSections(token);
      const expected = sections;
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
          json: () => Promise<Array<Section>>
        }> => {
          expect(url).toBe('host/api/v2/sections');
          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () => Promise.resolve(sections)
          });
        }
      );

      const {fetchSections} = require('./sections');
      const actual = fetchSections(token);
      const expected = sections;
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
      const actual = fetchSections(token);

      return expect(actual).rejects.toThrow();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
