// @flow

import {AsyncStorage} from 'react-native';

import {createDisciplineCard, createCardLevel} from '../../__fixtures__/cards';
import {createProgression, createState} from '../../__fixtures__/progression';
import createCompletion from '../../__fixtures__/completion';
import {ForbiddenError} from '../../models/error';
import {
  findById,
  getAll,
  save,
  findLast,
  buildLastProgressionKey,
  findBestOf,
  buildCompletionKey,
  mapProgressionToCompletion,
  mergeCompletion,
  storeOrReplaceCompletion
} from './progressions';

describe('progresssion', () => {
  describe('buildLastProgressionKey', () => {
    it('should build the lastProgression Key ', () => {
      const engineRef = 'lol';
      const contentRef = 'lipop';
      expect(buildLastProgressionKey(engineRef, contentRef)).toBeDefined();
    });
  });
  describe('findById', () => {
    it('shoud find a progression by id', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(fakeProgression)));

      const result = await findById(progressionId);

      expect(result).toEqual(fakeProgression);
    });

    it("shoud throw error if progression isn't found", async () => {
      const progressionId = 'fakeProgressionId';
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve());

      await expect(findById(progressionId)).rejects.toThrowError();
    });
  });
  describe('getAll', () => {
    it('shoud get all the progression items', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.getAllKeys = jest
        .fn()
        .mockImplementation(() => Promise.resolve([`progression_${progressionId}`, 'babababa']));

      AsyncStorage.multiGet = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual([`progression_${progressionId}`]);
        return Promise.resolve([[`progression_${progressionId}`, JSON.stringify(fakeProgression)]]);
      });

      const result = await getAll();

      expect(result).toEqual([fakeProgression]);
    });
  });
  describe('save', () => {
    it('shoud the progression and the last progression id simultaneously', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.setItem = jest
        .fn()
        .mockImplementationOnce((key, value) => {
          expect(key).toBe('progression_fakeProgressionId');
          expect(JSON.parse(value)).toEqual(fakeProgression);
        })
        .mockImplementationOnce((key, value) => {
          expect(key).toBe('last_progression_learner_foo');
          expect(value).toBe(fakeProgression._id);
        });

      const result = await save(fakeProgression);

      expect(result).toEqual(fakeProgression);
    });
    it('shoud add createAt in each action', async () => {
      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });
      fakeProgression.actions && fakeProgression.actions.forEach(action => delete action.createdAt);

      AsyncStorage.setItem = jest.fn();

      const result = await save(fakeProgression);

      expect(result.actions).toHaveLength(1);
      result.actions &&
        result.actions.forEach(action => {
          expect(action).toHaveProperty('createdAt');
        });
    });
    it('shoud throw on progression without _id', async () => {
      const fakeProgression = createProgression({
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      AsyncStorage.setItem = jest.fn().mockImplementation(() => {});

      const result = save(fakeProgression);

      await expect(result).rejects.toBeInstanceOf(TypeError);
    });
  });
  describe('findLast', () => {
    it('shoud find the last progression', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const state = createState({nextContent});
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);

      expect(result).toEqual(fakeProgression);
    });

    it('shoud find the last progression -- without retrieved progression id', async () => {
      AsyncStorage.getItem = jest.fn().mockImplementation(() => null);
      const result = await findLast('tata', 'toto');
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- without retrieved progression', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `last_progression_${engine}_${progressionContent.ref}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve();
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with success as nextContent type', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'success'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with failure as nextContent type', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'bar',
        type: 'failure'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- with node as nextContent type and extralife as ref', async () => {
      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };

      const nextContent = {
        ref: 'extraLife',
        type: 'node'
      };
      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        state: {
          nextContent
        }
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === `progression_${progressionId}`) {
          return Promise.resolve(progressionId);
        }
        return Promise.resolve(JSON.stringify(fakeProgression));
      });

      const result = await findLast(engine, progressionContent.ref);
      expect(result).toEqual(null);
    });
  });
  describe('synchronize', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });
    const TOKEN = '__TOKEN__';
    const HOST = 'https://coorp.mobile.com';
    it('should synchronize progression', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        nextContent
      });

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(`${HOST}/api/v2/progressions`);
        expect(options.method).toBe('POST');
        expect(options.headers).toEqual({
          Authorization: TOKEN,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        });
        expect({...fakeProgression, ...JSON.parse(options.body)}).toEqual({
          ...fakeProgression,
          meta: {source: 'mobile'}
        });
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve({})
        });
      });

      AsyncStorage.removeItem = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual(`progression_${progressionId}`);
        return Promise.resolve();
      });

      const {synchronize} = require('./progressions');
      await expect(synchronize(TOKEN, HOST, fakeProgression)).resolves.toBeUndefined();
    });

    it('should throw error if forbidden', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        nextContent
      });

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          status: 403,
          statusText: 'Forbidden',
          json: () => Promise.resolve({})
        });
      });

      AsyncStorage.removeItem = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual(`progression_${progressionId}`);
        return Promise.resolve();
      });

      const {synchronize} = require('./progressions');
      await expect(synchronize(TOKEN, HOST, fakeProgression)).rejects.toThrow(
        new ForbiddenError('Fetch Forbidden')
      );
    });

    it('should throw error if status code >= 400', async () => {
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        _id: progressionId,
        engine,
        progressionContent,
        nextContent
      });

      fetch.mockImplementationOnce((url, options) => {
        return Promise.resolve({
          status: 400,
          statusText: 'Foo bar baz',
          json: () => Promise.resolve({})
        });
      });

      AsyncStorage.removeItem = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual(`progression_${progressionId}`);
        return Promise.resolve();
      });

      const {synchronize} = require('./progressions');
      await expect(synchronize(TOKEN, HOST, fakeProgression)).rejects.toThrow(
        new Error('Foo bar baz')
      );
    });

    it('should support only progression with _id', async () => {
      const engine = 'learner';
      const progressionContent = {
        ref: 'foo',
        type: 'chapter'
      };
      const nextContent = {
        ref: 'bar',
        type: 'discipline'
      };

      const fakeProgression = createProgression({
        engine,
        progressionContent,
        nextContent
      });

      const {synchronize} = require('./progressions');
      await expect(synchronize(TOKEN, HOST, fakeProgression)).rejects.toBeInstanceOf(TypeError);
    });

    it('should return the completion key', () => {
      expect(buildCompletionKey('hey', 'ho')).toBeDefined();
    });

    it('should map a progression to a completion -- with provided total', () => {
      const progressionId = 'fakeProgressionId';
      const fakeState = createState({
        stars: 22,
        step: {
          current: 20
        }
      });
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        },
        state: fakeState
      });

      const result = mapProgressionToCompletion(fakeProgression);

      const expectedResult = {
        current: 19,
        stars: 22
      };

      expect(result).toEqual(expectedResult);
    });

    it('should map a progression to a completion -- without provided total', () => {
      const progressionId = 'fakeProgressionId';
      const fakeState = createState({
        stars: 22,
        step: {
          current: 20
        }
      });
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        },
        state: fakeState
      });

      const result = mapProgressionToCompletion(fakeProgression);

      const expectedResult = {
        current: 19,
        stars: 22
      };

      expect(result).toEqual(expectedResult);
    });

    it('should map a progression to a completion -- without state', () => {
      const progressionId = 'fakeProgressionId';

      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        }
      });

      expect(() => mapProgressionToCompletion(fakeProgression)).toThrow();
    });

    it('should merge two completion into a single one', () => {
      const completion1 = createCompletion({stars: 899, current: 33});
      const completion2 = createCompletion({stars: 898, current: 22});
      const result = mergeCompletion(completion1, completion2);
      const expectedResult = {stars: 899, current: 22};

      expect(result).toEqual(expectedResult);
    });

    it('should store the completion', async () => {
      const progressionId = 'fakeProgressionId';

      const fakeState = createState({
        stars: 22,
        step: {
          current: 20,
          total: 10
        }
      });

      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        },
        state: fakeState
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        return Promise.resolve(undefined);
      });

      AsyncStorage.mergeItem = jest.fn().mockImplementation(key => {
        return Promise.resolve(undefined);
      });

      AsyncStorage.setItem = jest.fn().mockImplementation(key => {
        return Promise.resolve(undefined);
      });

      const expectedResult = {
        stars: fakeState.stars,
        current: 19
      };
      const result = await storeOrReplaceCompletion(fakeProgression);

      expect(result).toEqual(expectedResult);
    });

    it('should update the completion', async () => {
      const progressionId = 'fakeProgressionId';

      const fakeState = createState({
        stars: 22,
        step: {
          current: 20,
          total: 10
        }
      });

      const expectedMaxStarCount = 666;

      const fakeProgression = createProgression({
        _id: progressionId,
        engine: 'learner',
        progressionContent: {
          ref: 'foo',
          type: 'chapter'
        },
        state: fakeState
      });

      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        return Promise.resolve(
          JSON.stringify(createCompletion({stars: expectedMaxStarCount, current: 9}))
        );
      });

      AsyncStorage.mergeItem = jest.fn().mockImplementation(key => {
        return Promise.resolve(undefined);
      });

      const expectedResult = {
        stars: expectedMaxStarCount,
        current: 19
      };
      const result = await storeOrReplaceCompletion(fakeProgression);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findBestOf', () => {
    it('shoud return a number of stars from an item', async () => {
      const language = 'en',
        progressionId = 'fakeProgressionId',
        engineRef = 'learner',
        content = {ref: 'foo', type: 'chapter'},
        contentRef = 'foo';

      const levelCard = createCardLevel({
        ref: 'mod_yeAh',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced'
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis_something',
        completion: 0,
        levels: [levelCard],
        title: 'Second discipline'
      });

      const fakeCardWithStars = {...disciplineCard, stars: 100};

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(fakeCardWithStars)));

      const result = await findBestOf(language)(engineRef, content, contentRef, progressionId);

      expect(result).toEqual(100);
    });
  });
});
