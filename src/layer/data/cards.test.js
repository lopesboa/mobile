// @flow strict

import basic from '../../__fixtures__/discipline-bundle/basic';
import adaptive from '../../__fixtures__/discipline-bundle/adaptive';
import noClue from '../../__fixtures__/discipline-bundle/no-clue';
import withContextVideo from '../../__fixtures__/discipline-bundle/context-with-video';
import withContextImage from '../../__fixtures__/discipline-bundle/context-with-image';
import onboarding from '../../__fixtures__/__temporary__/onboarding-course';
import bescherelle from '../../__fixtures__/__temporary__/bescherelle-course';

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
      const result = fetchCards('fr');
      const disciplines = {
        ...basic.disciplines,
        ...adaptive.disciplines,
        ...noClue.disciplines,
        ...withContextVideo.disciplines,
        ...withContextImage.disciplines
      };
      const expected = Object.keys(disciplines).map(key => disciplines[key]);
      expect(result).resolves.toBe(expected);
    });

    it('should fetch fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      const {fetchCards} = require('./cards');
      const result = fetchCards('fr');
      const disciplines = {
        ...onboarding.disciplines,
        ...bescherelle.disciplines
      };

      const expected = Object.keys(disciplines).map(key => disciplines[key]);
      expect(result).resolves.toBe(expected);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });
  });
});
