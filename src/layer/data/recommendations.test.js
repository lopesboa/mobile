// @flow

import {createChapterCard} from '../../__fixtures__/cards';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import type {Completion, DisciplineCard, ChapterCard} from './_types';

describe('Recommendation data layer', () => {
  describe('fetchRecommendation', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.mock('../../utils/local-token', () => {
        const {createToken} = require('../../__fixtures__/tokens');
        return {
          get: jest.fn(() => Promise.resolve(createToken({})))
        };
      });
    });

    it('should fetch a recommendation with completion update', async () => {
      const microLearningSlideToComplete = 4;
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');
      const mockCard = createChapterCard({
        ref: 'foo',
        status: 'isStarted',
        title: 'plop',
        stars: 20,
        completion: 0.3
      });
      const completion: Completion = {
        current: 3,
        stars: 10
      };

      AsyncStorage.getItem.mockImplementation(key =>
        Promise.resolve(
          key === 'completion_microlearning_foo' ? JSON.stringify(completion) : undefined
        )
      );

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe('https://domain.tld/api/v2/recommendations?contentType=all&lang=en');

          return Promise.resolve({
            json: () => Promise.resolve({hits: [mockCard]})
          });
        }
      );

      const {fetchRecommendation} = require('./recommendations');
      const card = await fetchRecommendation();
      return expect(card).toEqual({
        ...mockCard,
        completion: completion.current / microLearningSlideToComplete
      });
    });

    it('should fetch a card without completion in async storage', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');
      const mockCard = createChapterCard({
        ref: 'foo',
        status: 'isStarted',
        title: 'plop',
        completion: 0.5,
        stars: 20
      });

      AsyncStorage.getItem.mockImplementation(key => Promise.resolve(undefined));

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe('https://domain.tld/api/v2/recommendations?contentType=all&lang=en');

          return Promise.resolve({
            json: () => Promise.resolve({hits: [mockCard]})
          });
        }
      );

      const {fetchRecommendation} = require('./recommendations');
      const card = await fetchRecommendation();
      return expect(card).toEqual(mockCard);
    });

    it('should return undefined if no recommendation is found', async () => {
      const fetch = require('cross-fetch');
      const {get} = require('../../utils/local-token');
      const {createToken} = require('../../__fixtures__/tokens');
      const token = createToken({});

      // $FlowFixMe mocking
      get.mockImplementationOnce(() => Promise.resolve(token));

      fetch.mockImplementationOnce(
        (
          url,
          params
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(params.headers.authorization).toEqual(token);
          expect(url).toBe('https://domain.tld/api/v2/recommendations?contentType=all&lang=en');

          return Promise.resolve({
            json: () => Promise.resolve({hits: []})
          });
        }
      );

      const {fetchRecommendation} = require('./recommendations');
      const recommendation = await fetchRecommendation();
      return expect(recommendation).toEqual(undefined);
    });

    it('should return throw error', async () => {
      const fetch = require('cross-fetch');
      const {get} = require('../../utils/local-token');

      // $FlowFixMe mocking
      get.mockImplementationOnce(() => Promise.resolve(null));

      const {fetchRecommendation} = require('./recommendations');
      const fetching = fetchRecommendation();

      await expect(fetching).rejects.toThrow(new Error('Invalid token'));
      expect(fetch).toHaveBeenCalledTimes(0);
    });

    it('should fetch e2e fixtures', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));

      const {fetchRecommendation} = require('./recommendations');

      const result = await fetchRecommendation();
      const expected = disciplinesBundle.disciplines.adaptive_dis_1;

      return expect(result && result.universalRef).toEqual(expected.universalRef);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
