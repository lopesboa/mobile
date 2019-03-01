// @flow strict

import basic from '../../__fixtures__/discipline-bundle/basic';
import adaptive from '../../__fixtures__/discipline-bundle/adaptive';
import noClue from '../../__fixtures__/discipline-bundle/no-clue';
import withContextVideo from '../../__fixtures__/discipline-bundle/context-with-video';
import withContextImage from '../../__fixtures__/discipline-bundle/context-with-image';
import onboarding from '../../__fixtures__/__temporary__/onboarding-course';
import bescherelle from '../../__fixtures__/__temporary__/bescherelle-course';
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
      const result = fetchCards(LANGUAGE, HOST, TOKEN);
      const disciplines = {
        ...basic.disciplines,
        ...adaptive.disciplines,
        ...noClue.disciplines,
        ...withContextVideo.disciplines,
        ...withContextImage.disciplines
      };
      const expected = createDisciplinesCards(
        Object.keys(disciplines).map(key => disciplines[key])
      );
      return expect(result).resolves.toEqual(expected);
    });

    const onboardingCard = createDisciplinesCards(
      Object.keys(onboarding.disciplines).map(key => onboarding.disciplines[key])
    ).pop();
    const bescherelleCard = createDisciplinesCards(
      Object.keys(bescherelle.disciplines).map(key => bescherelle.disciplines[key])
    ).pop();

    it('should fetch favorites and recommendations to populate dashboard cards', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${HOST}/api/v2/contents?contentType=course&limit=5&playlist=favorites&lang=en`
        );

        expect(options).toHaveProperty('headers.authorization', TOKEN);

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: [onboardingCard, onboardingCard]
            })
        });
      });
      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(`${HOST}/api/v2/recommendations?contentType=course&limit=5&lang=en`);

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: [bescherelleCard, bescherelleCard, bescherelleCard]
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(LANGUAGE, HOST, TOKEN);

      const expected = [
        onboardingCard,
        onboardingCard,
        bescherelleCard,
        bescherelleCard,
        bescherelleCard
      ];
      await expect(result).resolves.toEqual(expected);
    });

    it('should fetch only favorites', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        const favorites = [
          onboardingCard,
          onboardingCard,
          onboardingCard,
          onboardingCard,
          onboardingCard
        ];

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: favorites
            })
        });
      });
      fetch.mockImplementationOnce((url, options) => {
        const recommendations = [
          bescherelleCard,
          bescherelleCard,
          bescherelleCard,
          bescherelleCard,
          bescherelleCard
        ];

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: recommendations
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(LANGUAGE, HOST, TOKEN);

      const expected = [
        onboardingCard,
        onboardingCard,
        onboardingCard,
        onboardingCard,
        onboardingCard
      ];
      await expect(result).resolves.toEqual(expected);
    });

    it('should fetch recommendations to fill', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        const favorites = [];

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: favorites
            })
        });
      });
      fetch.mockImplementationOnce((url, options) => {
        const recommendations = [
          bescherelleCard,
          bescherelleCard,
          bescherelleCard,
          bescherelleCard,
          bescherelleCard
        ];

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: recommendations
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(LANGUAGE, HOST, TOKEN);

      const expected = [
        bescherelleCard,
        bescherelleCard,
        bescherelleCard,
        bescherelleCard,
        bescherelleCard
      ];
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
      const result = fetchCards(LANGUAGE, HOST, TOKEN);

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
      const result = fetchCards(LANGUAGE, HOST, TOKEN);

      const expected = [];
      await expect(result).resolves.toEqual(expected);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });
  });
});
