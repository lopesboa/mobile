// @flow

import type {LevelAPI} from '@coorpacademy/player-services';
import {fakeError} from '../../utils/tests';
import {createLevelAPI} from '../../__fixtures__/levels';
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
import {createSections} from '../../__fixtures__/sections';
import {
  cardsToKeys,
  updateDisciplineCardDependingOnCompletion,
  updateChapterCardAccordingToCompletion
} from './cards';
import {CONTENT_TYPE} from './_const';
import type {Completion, DisciplineCard, ChapterCard, Card} from './_types';

const host = 'https://host.coorpacademy.com';
const endpoint = '/api/v1/fake';
const token = '__token__';

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

      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
    });

    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchCards} = require('./cards');
      const result = fetchCards(token, host, endpoint, 1, 3);
      const expected = {
        cards: cards.slice(1, 4),
        total: cards.length
      };

      return expect(result).resolves.toEqual(expected);
    });

    it('should fetch cards', async () => {
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
            hits: Array<Card>
          |}>
        }> => {
          expect(url).toBe(`${host}${endpoint}?offset=0&limit=2&lang=en&withoutAdaptive=true`);

          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () =>
              Promise.resolve({
                search_meta: {
                  total: cards.length
                },
                hits: cards.slice(0, 2)
              })
          });
        }
      );

      const {fetchCards} = require('./cards');
      const result = fetchCards(token, host, endpoint, 0, 2);
      const expected = {
        cards: cards.slice(0, 2),
        total: cards.length
      };

      await expect(result).resolves.toEqual(expected);
    });

    it('should reject error', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {fetchCards} = require('./cards');
      const result = fetchCards(token, host, endpoint, 0, 3);

      await expect(result).rejects.toThrow();
    });

    it("should returns empty array if apis doesn't have results", async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              search_meta: {
                total: 0
              },
              hits: []
            })
        });
      });

      const {fetchCards} = require('./cards');
      const result = fetchCards(token, host, endpoint, 0, 3);

      const expected = {
        cards: [],
        total: 0
      };
      await expect(result).resolves.toEqual(expected);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('fetchSectionCards', () => {
    const section = createSections()[0];

    beforeEach(() => {
      jest.resetModules();

      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
    });

    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchSectionCards} = require('./cards');
      const result = fetchSectionCards(token, host, section, 1, 3);
      const expected = {
        cards: cards.slice(1, 4),
        total: cards.length
      };

      return expect(result).resolves.toEqual(expected);
    });

    it('should fetch cards', async () => {
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
            hits: Array<Card>
          |}>
        }> => {
          expect(url).toBe(
            `${host}${
              section.endpoint
            }?contentType=all&offset=0&limit=2&lang=en&withoutAdaptive=true`
          );

          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () =>
              Promise.resolve({
                search_meta: {
                  total: cards.length
                },
                hits: cards.slice(0, 2)
              })
          });
        }
      );

      const {fetchSectionCards} = require('./cards');
      const result = fetchSectionCards(token, host, section, 0, 2);
      const expected = {
        cards: cards.slice(0, 2),
        total: cards.length
      };

      await expect(result).resolves.toEqual(expected);
    });

    it('should reject error', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {fetchSectionCards} = require('./cards');
      const result = fetchSectionCards(token, host, section, 0, 3);

      await expect(result).rejects.toThrow();
    });

    it("should returns empty array if apis doesn't have results", async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              search_meta: {
                total: 0
              },
              hits: []
            })
        });
      });

      const {fetchSectionCards} = require('./cards');
      const result = fetchSectionCards(token, host, section, 0, 3);

      const expected = {
        cards: [],
        total: 0
      };
      await expect(result).resolves.toEqual(expected);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('fetchSearchCards', () => {
    const search = 'foo bar baz';

    beforeEach(() => {
      jest.resetModules();

      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
    });

    it('should fetch e2e fixtures', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchSearchCards} = require('./cards');
      const result = fetchSearchCards(token, host, search, 1, 3);
      const expected = {
        cards: cards.slice(1, 4),
        total: cards.length
      };

      return expect(result).resolves.toEqual(expected);
    });

    it('should fetch cards', async () => {
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
            hits: Array<Card>
          |}>
        }> => {
          expect(url).toBe(
            `${host}/api/v2/contents?fullText=foo%20bar%20baz&offset=0&limit=2&lang=en&withoutAdaptive=true`
          );

          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () =>
              Promise.resolve({
                search_meta: {
                  total: cards.length
                },
                hits: cards.slice(0, 2)
              })
          });
        }
      );

      const {fetchSearchCards} = require('./cards');
      const result = fetchSearchCards(token, host, search, 0, 2);
      const expected = {
        cards: cards.slice(0, 2),
        total: cards.length
      };

      await expect(result).resolves.toEqual(expected);
    });

    it('should reject error', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {fetchSearchCards} = require('./cards');
      const result = fetchSearchCards(token, host, search, 0, 3);

      await expect(result).rejects.toThrow();
    });

    it("should returns empty array if apis doesn't have results", async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              search_meta: {
                total: 0
              },
              hits: []
            })
        });
      });

      const {fetchSearchCards} = require('./cards');
      const result = fetchSearchCards(token, host, search, 0, 3);

      const expected = {
        cards: [],
        total: 0
      };
      await expect(result).resolves.toEqual(expected);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('fetchCard', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.mock('cross-fetch');

      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));

      jest.mock('../../utils/local-token', () => {
        const {createToken} = require('../../__fixtures__/tokens');
        return {
          get: jest.fn(() => Promise.resolve(createToken({})))
        };
      });
    });

    it('should fetch e2e fixtures', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));

      const {fetchCard} = require('./cards');

      const discipline = disciplinesBundle.disciplines.with_slider_dis_1;
      // $FlowFixMe union type
      const result = await fetchCard({
        ref: discipline.modules[0].universalRef,
        type: CONTENT_TYPE.LEVEL
      });

      return expect(result.universalRef).toEqual(discipline.universalRef);
    });

    it('should fetch a card with completion update', async () => {
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
          expect(url).toBe(
            'https://domain.tld/api/v2/contents?type=chapter&universalRef=foo&lang=en'
          );

          return Promise.resolve({
            json: () => Promise.resolve({hits: [mockCard]})
          });
        }
      );

      const {fetchCard} = require('./cards');
      const card = await fetchCard({ref: 'foo', type: CONTENT_TYPE.CHAPTER});
      expect(card).toEqual({
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
          expect(url).toBe(
            'https://domain.tld/api/v2/contents?type=chapter&universalRef=foo&lang=en'
          );

          return Promise.resolve({
            json: () => Promise.resolve({hits: [mockCard]})
          });
        }
      );

      const {fetchCard} = require('./cards');
      const card = await fetchCard({ref: 'foo', type: CONTENT_TYPE.CHAPTER});
      expect(card).toEqual(mockCard);
    });

    it('should fetch a level on api contents', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');

      const discipline = disciplinesCards[0];
      const level = createLevelAPI({
        chapterIds: [],
        // $FlowFixMe module is defined
        ref: discipline.modules[0].universalRef,
        disciplineRef: 'foo',
        disciplineUniversalRef: discipline.universalRef
      });
      // $FlowFixMe its defined
      const levelUniversalRef: string = level.universalRef;
      // $FlowFixMe its defined
      const disciplineUniversalRef: string = level.disciplineUniversalRef;

      AsyncStorage.getItem.mockImplementation(key => Promise.resolve(undefined));

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<LevelAPI>
        }> => {
          expect(url).toBe(`https://domain.tld/api/v2/levels/${levelUniversalRef}`);

          return Promise.resolve({
            json: () => Promise.resolve(level)
          });
        }
      );

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe(
            `https://domain.tld/api/v2/contents?type=course&universalRef=${disciplineUniversalRef}&lang=en`
          );

          return Promise.resolve({
            json: () => Promise.resolve({hits: [discipline]})
          });
        }
      );

      const {fetchCard} = require('./cards');
      const card = await fetchCard({ref: levelUniversalRef, type: CONTENT_TYPE.LEVEL});

      expect(card).toEqual(discipline);
    });

    it('should return undefined if no card is found', async () => {
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe(
            'https://domain.tld/api/v2/contents?type=chapter&universalRef=foo&lang=en'
          );

          return Promise.resolve({
            json: () => Promise.resolve({hits: []})
          });
        }
      );

      const {fetchCard} = require('./cards');
      const card = await fetchCard({ref: 'foo', type: CONTENT_TYPE.CHAPTER});
      return expect(card).toEqual(undefined);
    });

    it('should return throw error', async () => {
      const localToken = require('../../utils/local-token');
      // $FlowFixMe this function is mocked;
      localToken.get.mockImplementationOnce(() => Promise.resolve(null));

      const {fetchCard} = require('./cards');
      const fetching = fetchCard({ref: 'foo', type: CONTENT_TYPE.CHAPTER});
      await expect(fetching).rejects.toThrow(new Error('Invalid token'));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('completion', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.mock('cross-fetch');

      jest.mock('../../utils/local-token', () => {
        const {createToken} = require('../../__fixtures__/tokens');
        return {
          get: jest.fn(() => Promise.resolve(createToken({})))
        };
      });
    });

    it('should fetch many cards with completion update', async () => {
      const microLearningSlideToComplete = 4;
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');
      const mockCard1 = createChapterCard({
        ref: 'foo',
        status: 'isStarted',
        title: 'plop',
        stars: 20,
        completion: 0.3
      });

      const mockCard2 = createChapterCard({
        ref: 'bar',
        status: 'isStarted',
        title: 'plop',
        stars: 66,
        completion: 0.3
      });
      const completion1: Completion = {
        current: 3,
        stars: 10
      };
      const completion2: Completion = {
        current: 3,
        stars: 10
      };

      AsyncStorage.getItem.mockImplementation(key => {
        if (key === 'completion_microlearning_foo') {
          return Promise.resolve(JSON.stringify(completion1));
        }
        if (key === 'completion_microlearning_bar') {
          return Promise.resolve(JSON.stringify(completion2));
        }

        return Promise.resolve(undefined);
      });

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe(`${host}${endpoint}?offset=1&limit=3&lang=en&withoutAdaptive=true`);

          return Promise.resolve({
            json: () => Promise.resolve({search_meta: {total: 2}, hits: [mockCard1, mockCard2]})
          });
        }
      );

      const {fetchCards} = require('./cards');
      const {cards: _cards} = await fetchCards(token, host, endpoint, 1, 3);
      expect(_cards[0]).toEqual({
        ...mockCard1,
        completion: completion1.current / microLearningSlideToComplete
      });
      expect(_cards[1]).toEqual({
        ...mockCard2,
        completion: completion2.current / microLearningSlideToComplete
      });
    });

    it('should fetch many cards without completion in async storage', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');
      const mockCard1 = createChapterCard({
        ref: 'foo',
        status: 'isStarted',
        title: 'plop',
        stars: 20,
        completion: 0.3
      });

      const mockCard2 = createChapterCard({
        ref: 'bar',
        status: 'isStarted',
        title: 'plop',
        stars: 66,
        completion: 0.3
      });

      AsyncStorage.getItem.mockImplementation(key => {
        return Promise.resolve(undefined);
      });

      fetch.mockImplementationOnce(
        (
          url
        ): Promise<{
          json: () => Promise<{hits: Array<DisciplineCard | ChapterCard | void>}>
        }> => {
          expect(url).toBe(`${host}${endpoint}?offset=1&limit=3&lang=en&withoutAdaptive=true`);

          return Promise.resolve({
            json: () => Promise.resolve({search_meta: {total: 2}, hits: [mockCard1, mockCard2]})
          });
        }
      );

      const {fetchCards} = require('./cards');
      const {cards: _cards} = await fetchCards(token, host, endpoint, 1, 3);
      expect(_cards[0]).toEqual(mockCard1);
      expect(_cards[1]).toEqual(mockCard2);
    });

    afterEach(() => {
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

  describe('getCardFromLocalStorage', () => {
    it('should get card card', async () => {
      const _card = cards[1];
      const AsyncStorage = require('@react-native-community/async-storage');
      const {getCardFromLocalStorage} = require('./cards');
      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === '@@lang') {
          return 'en';
        }
        if (key === `card:en:${_card.ref}`) {
          return JSON.stringify(_card);
        }
      });

      const card = await getCardFromLocalStorage(_card.ref);
      expect(_card).toEqual(card);
    });
  });

  describe('refresh card', () => {
    it('should refresh the discipline card', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {refreshCard} = require('./cards');

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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {refreshCard} = require('./cards');

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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {refreshCard} = require('./cards');

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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {refreshCard} = require('./cards');

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

  describe('saveDashboardCardsInAsyncStorage', () => {
    beforeEach(() => {
      jest.resetModules();

      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
    });

    it('should save cards in async storage', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.multiSet.mockImplementation(values => {
        const result = values.map(value => value[0]);
        const expected = [
          'card:en:adaptive_dis_1',
          'card:en:adaptive_mod_1',
          'card:en:basic_dis_1',
          'card:en:basic_mod_1',
          'card:en:basic_mod_2',
          'card:en:with_image_context_dis_1',
          'card:en:with_image_context_mod_1',
          'card:en:with_video_context_dis_2',
          'card:en:with_video_context_mod_2',
          'card:en:with_pdf_context_dis_2',
          'card:en:with_pdf_context_mod_2',
          'card:en:no_clue_dis_1',
          'card:en:no_clue_mod_1',
          'card:en:template_dis_1',
          'card:en:template_mod_1',
          'card:en:qcm_drag_dis_1',
          'card:en:qcm_drag_mod_1',
          'card:en:with_slider_dis_1',
          'card:en:with_slider_mod_2',
          'card:en:question_basic_dis_1',
          'card:en:question_basic_mod_1',
          'card:en:locked_dis_1',
          'card:en:locked_mod_1'
        ];
        // we don't want to test all fixtures, only the keys
        expect(result).toEqual(expected);

        return Promise.resolve();
      });

      const {saveDashboardCardsInAsyncStorage} = require('./cards');

      await saveDashboardCardsInAsyncStorage(disciplinesCards, 'en');

      expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.multiSet.mockImplementationOnce(() => Promise.reject(fakeError));

      const {saveDashboardCardsInAsyncStorage} = require('./cards');

      const result = saveDashboardCardsInAsyncStorage(disciplinesCards, 'en');

      await expect(result).rejects.toThrow('could not store the dashboard cards');

      expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('cardsToKeys', () => {
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
  });
});
