// @flow strict

import {AsyncStorage} from 'react-native';
import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import chaptersBundle from '../../__fixtures__/chapter-bundle';
import {
  createDisciplinesCards,
  createDisciplineCard,
  createChaptersCards,
  createCardLevel,
  createChapterCard
} from '../../__fixtures__/cards';

import createCompletion from '../../__fixtures__/completion';
import {
  cardsToKeys,
  updateDisciplineCardDependingOnCompletion,
  updateChapterCardAccordingToCompletion,
  refreshCard
} from './cards';

const HOST = 'https://host.coorpacademy.com';
const TOKEN = '__TOKEN__';
const LANGUAGE = 'en';

const disciplinesCards = createDisciplinesCards(
  Object.keys(disciplinesBundle.disciplines).map(key => disciplinesBundle.disciplines[key])
);
const chaptersCards = createChaptersCards(
  Object.keys(chaptersBundle.chapters).map(key => chaptersBundle.chapters[key])
);
const cards = disciplinesCards.concat(chaptersCards);

describe('cards', () => {
  describe('fetchCards', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should create card to keys', () => {
      const chapterCard = createChapterCard({
        ref: 'test',
        title: 'title',
        completion: 0,
        status: 'isActive'
      });

      const keyedChapterCard = cardsToKeys([chapterCard], 'en');

      expect(Object.keys(keyedChapterCard)).toEqual(['card:en:test']);
    });

    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchCards} = require('./cards');
      const result = fetchCards(TOKEN, HOST, LANGUAGE);
      const expected = cards;

      return expect(result).resolves.toEqual(expected);
    });

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

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${HOST}/api/v2/most-popular?contentType=course&limit=5&withoutAdaptive=true&lang=en`
        );

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: cards.slice(0, 1)
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

      const mostPopular = cards.slice(2, 5);
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: mostPopular
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
      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              hits: []
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

  describe('update cards according to progression', () => {
    it('should update the  cards total star count', () => {
      const fakeRef = 'lolipop';

      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        stars: 0,
        label: 'fakeLabel'
      });

      const level2 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        stars: 0,
        label: 'fakeLabel'
      });

      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        completion: 0,
        levels: [level1, level2],
        title: 'fakeTitle'
      });

      const completion1 = createCompletion({stars: 100});
      const completion2 = createCompletion({stars: 100});

      const expectedResult = {
        ...disciplineCard,
        stars: 200,
        modules: [
          {
            ...level1,
            stars: 100
          },
          {
            ...level2,
            stars: 100
          }
        ]
      };

      const result = updateDisciplineCardDependingOnCompletion(
        [completion1, completion2],
        disciplineCard
      );

      expect(result).toEqual(expectedResult);
    });
    it('should update the star count inside disicpline card', () => {
      const fakeRef = 'lolipop';

      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        stars: 0,
        label: 'fakeLabel'
      });

      const expectedStarsCountLevel = 1000;

      const level2 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        stars: expectedStarsCountLevel,
        label: 'fakeLabel'
      });

      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        completion: 0,
        levels: [level1, level2],
        title: 'fakeTitle'
      });

      const completion1 = createCompletion({stars: expectedStarsCountLevel});
      const completion2 = createCompletion({stars: 0});

      const expectedResult = {
        ...disciplineCard,
        stars: 2000,
        modules: [
          {
            ...level1,
            stars: expectedStarsCountLevel
          },
          {
            ...level2,
            stars: expectedStarsCountLevel
          }
        ]
      };

      const result = updateDisciplineCardDependingOnCompletion(
        [completion1, completion2],
        disciplineCard
      );

      expect(result).toEqual(expectedResult);
    });

    it('should update the star count inside disicpline card -- max star in card', () => {
      const expectedStarsCountLevel = 99999;

      const chapterCard = createChapterCard({
        ref: 'lol',
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: expectedStarsCountLevel
      });

      const completion = createCompletion({stars: 0});

      const expectedResult = {
        ...chapterCard,
        stars: expectedStarsCountLevel
      };

      const result = updateChapterCardAccordingToCompletion(completion, chapterCard);

      expect(result).toEqual(expectedResult);
    });

    it('should update the star count inside disicpline card -- max star in completion', () => {
      const expectedStarsCountLevel = 1000;

      const chapterCard = createChapterCard({
        ref: 'lol',
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0
      });

      const completion = createCompletion({stars: expectedStarsCountLevel});

      const expectedResult = {
        ...chapterCard,
        stars: expectedStarsCountLevel
      };

      const result = updateChapterCardAccordingToCompletion(completion, chapterCard);

      expect(result).toEqual(expectedResult);
    });

    it('should update the disicpline card completion rate -- if computed rate < 1', () => {
      const fakeRef = 'lolipop';

      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: 0,
        label: 'fakeLabel',
        nbChapters: 2
      });

      const nbChapters = 1;
      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0,
        levels: [level1]
      });
      const currentCompletionRate = 4;
      const completion1 = createCompletion({stars: 0, current: currentCompletionRate});
      const expectedLevelCompletionRate = 0.5;

      const expectedResult = {
        ...disciplineCard,
        stars: 0,
        completion: expectedLevelCompletionRate,
        modules: [
          {
            ...level1,
            completion: expectedLevelCompletionRate
          }
        ]
      };

      const result = updateDisciplineCardDependingOnCompletion([completion1], disciplineCard);

      expect(result).toEqual(expectedResult);
    });

    it('should update the disicpline card completion rate -- if computed rate > 1', () => {
      const fakeRef = 'lolipop';

      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: 0,
        label: 'fakeLabel'
      });

      const nbChapters = 1;
      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0,
        levels: [level1]
      });
      const currentCompletionRate = 666;
      const completion1 = createCompletion({stars: 0, current: currentCompletionRate});
      const expectedLevelCompletionRate = 1;

      const expectedResult = {
        ...disciplineCard,
        stars: 0,
        completion: expectedLevelCompletionRate,
        modules: [
          {
            ...level1,
            completion: expectedLevelCompletionRate
          }
        ]
      };

      const result = updateDisciplineCardDependingOnCompletion([completion1], disciplineCard);

      expect(result).toEqual(expectedResult);
    });

    it('should compute the card complation rate with some levels', () => {
      const fakeRef = 'lolipop';

      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: 0,
        label: 'fakeLabel',
        nbChapters: 2
      });

      const level2 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: 0,
        label: 'fakeLabel',
        nbChapters: 2
      });

      const nbChapters = 1;
      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0,
        levels: [level1, level2]
      });
      const currentCompletionRate1 = 666;
      const completion1 = createCompletion({stars: 0, current: currentCompletionRate1});
      const expectedLevelCompletionRate1 = 1;

      const currentCompletionRate2 = 4;
      const completion2 = createCompletion({stars: 0, current: currentCompletionRate2});
      const expectedLevelCompletionRate2 = 0.5;

      const expectedResult = {
        ...disciplineCard,
        stars: 0,
        completion: (expectedLevelCompletionRate1 + expectedLevelCompletionRate2) / 2,
        modules: [
          {
            ...level1,
            completion: expectedLevelCompletionRate1
          },
          {
            ...level2,
            completion: expectedLevelCompletionRate2
          }
        ]
      };

      const result = updateDisciplineCardDependingOnCompletion(
        [completion1, completion2],
        disciplineCard
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh card', () => {
    it('should refresh the discipline card', async () => {
      const minStar = 0;
      const maxStars = 666;
      const fakeRef = 'yolo';
      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: minStar,
        label: 'fakeLabel'
      });

      const nbChapters = 1;
      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0,
        levels: [level1]
      });

      const completion = createCompletion({stars: maxStars, current: 0});

      const completionKey = `completion_learner_${level1.ref}`;

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === completionKey) {
          return Promise.resolve(JSON.stringify(completion));
        }
      });

      const result = await refreshCard(disciplineCard);

      const expectedResult = {
        ...disciplineCard,
        stars: maxStars,
        modules: [
          {
            ...level1,
            stars: maxStars
          }
        ]
      };

      expect(result).toEqual(expectedResult);
    });

    it('should refresh the discipline card -- without stored completion found', async () => {
      const minStar = 0;
      const fakeRef = 'yolo';
      const level1 = createCardLevel({
        ref: fakeRef,
        status: 'isStarted',
        completion: 0,
        stars: minStar,
        label: 'fakeLabel'
      });

      const nbChapters = 1;
      const disciplineCard = createDisciplineCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0,
        levels: [level1]
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(undefined));

      const result = await refreshCard(disciplineCard);

      expect(result).toEqual(disciplineCard);
    });

    it('should refresh the chapter Card', async () => {
      const maxStars = 666;
      const nbChapters = 1;
      const slidesToComplete = 4;
      const chapterCard = createChapterCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0
      });

      const completion = createCompletion({stars: maxStars, current: 2});

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(completion)));

      const result = await refreshCard(chapterCard);

      const expectedResult = {
        ...chapterCard,
        completion: completion.current / slidesToComplete,
        stars: maxStars
      };

      expect(result).toEqual(expectedResult);
    });

    it('should refresh the chapter Card -- without stored completion', async () => {
      const nbChapters = 1;
      const chapterCard = createChapterCard({
        ref: 'lol',
        nbChapters,
        completion: 0,
        status: 'isStarted',
        title: 'fakeTitle',
        stars: 0
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(undefined));

      const result = await refreshCard(chapterCard);

      expect(result).toEqual(chapterCard);
    });
  });
});
