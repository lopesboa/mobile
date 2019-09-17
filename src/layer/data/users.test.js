// @flow strict

import {createToken} from '../../__fixtures__/tokens';
import {createBrand} from '../../__fixtures__/brands';
import {createUser} from '../../__fixtures__/user';
import {fakeError} from '../../utils/tests';
import type {FetchUserResponse} from './users';

const brand = createBrand();
const token = createToken({host: brand.host});

const user = createUser();

const fetchedUser: FetchUserResponse = {
  name: {
    givenName: user.givenName,
    familyName: user.familyName
  },
  displayName: user.displayName
};

describe('brand', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('fetchUser', () => {
    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchUser} = require('./users');
      const actual = fetchUser(token);
      const expected = user;
      return expect(actual).resolves.toEqual(expected);
    });

    it('should fetch config and return user', () => {
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
          json: () => Promise<FetchUserResponse>
        }> => {
          expect(url).toBe(`${brand.host}/api/v1/users/me`);

          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () => Promise.resolve(fetchedUser)
          });
        }
      );

      const {fetchUser} = require('./users');
      const actual = fetchUser(token);
      const expected = user;
      return expect(actual).resolves.toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {fetchUser} = require('./users');
      const actual = fetchUser(token);

      return expect(actual).rejects.toThrow();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
