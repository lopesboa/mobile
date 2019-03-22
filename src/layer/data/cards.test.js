// @flow strict

import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import {createDisciplinesCards} from '../../__fixtures__/cards';

const HOST = 'https://host.coorpacademy.com';
const TOKEN = '__TOKEN__';
const LANGUAGE = 'en';

describe('cards', () => {
  describe('fetchCards', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);
      const expected = createDisciplinesCards(
        Object.keys(disciplinesBundle.disciplines).map(key => disciplinesBundle.disciplines[key])
      );
      return expect(result).resolves.toEqual(expected);
    });

    const cards = createDisciplinesCards(
      Object.keys(disciplinesBundle.disciplines).map(key => disciplinesBundle.disciplines[key])
    );

    it('should fetch favorites and recommendations to populate dashboard cards', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${HOST}/api/v2/contents?contentType=course&limit=5&playlist=favorites&withoutAdaptive=true&lang=en`
        );

        expect(options).toHaveProperty('headers.authorization', TOKEN);

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: cards.slice(0, 2)
            })
        });
      });
      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${HOST}/api/v2/recommendations?contentType=course&limit=5&withoutAdaptive=true&lang=en`
        );

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: cards.slice(2, 7)
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      const expected = cards.slice(0, 5);
      await expect(result).resolves.toEqual(expected);
    });

    it('should fetch only favorites', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const favorites = cards.slice(0, 5);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: favorites
            })
        });
      });
      const recommendations = cards.slice(5, 10);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: recommendations
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      const expected = favorites;
      await expect(result).resolves.toEqual(expected);
    });

    it('should return unique cards', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const favorites = cards.slice(0, 3);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: favorites
            })
        });
      });
      const recommendations = cards.slice(1, 5);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: recommendations
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      const expected = cards.slice(0, 5);
      await expect(result).resolves.toEqual(expected);
    });

    it('should fetch recommendations to fill', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const favorites = [];
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: favorites
            })
        });
      });
      const recommendations = cards.slice(0, 5);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: recommendations
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      const expected = recommendations;
      await expect(result).resolves.toEqual(expected);
    });
    it('should reject error', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(new Error()));
      fetch.mockImplementationOnce((url, options) => Promise.reject(new Error()));

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      await expect(result).rejects.toThrow();
    });

    it("should returns empty array if apis doesn't have results", async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () => Promise.resolve({})
        });
      });
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () => Promise.resolve({})
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);

      const expected = [];
      await expect(result).resolves.toEqual(expected);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });
  });
});
