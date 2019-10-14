// @flow

import type {ContentType} from '@coorpacademy/progression-engine';

import {createProgression, createState, createAction} from '../../__fixtures__/progression';
import createCompletion from '../../__fixtures__/completion';
import {createToken} from '../../__fixtures__/tokens';
import {ForbiddenError} from '../../models/error';
import {ENGINE} from '../../const';
import {CONTENT_TYPE} from './_const';
import type {FindBestOfResult} from './progressions';

jest.mock('cross-fetch');

describe('Progressions', () => {
  describe('buildLastProgressionKey', () => {
    it('should build the lastProgression Key ', () => {
      const {buildLastProgressionKey} = require('./progressions');

      const engineRef = 'lol';
      const contentRef = 'lipop';
      expect(buildLastProgressionKey(engineRef, contentRef)).toBeDefined();
    });
  });

  describe('findById', () => {
    it('shoud find a progression by id', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findById} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
        }
      });

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(fakeProgression)));

      const result = await findById(progressionId);

      expect(result).toEqual(fakeProgression);
    });

    it("shoud throw error if progression isn't found", async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findById} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve());

      await expect(findById(progressionId)).rejects.toThrowError();
    });
  });
  describe('getAll', () => {
    it('shoud get all the progression items', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {getAll} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {save} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {save} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
        },
        actions: [createAction({}), createAction({})]
      });

      AsyncStorage.setItem = jest.fn();

      const result = await save(fakeProgression);

      expect(result.actions).toHaveLength(2);
      result.actions &&
        result.actions.forEach(action => {
          expect(action).toHaveProperty('createdAt');
        });
    });

    it('shoud throw on progression without _id', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {save} = require('./progressions');

      const fakeProgression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
        }
      });

      AsyncStorage.setItem = jest.fn().mockImplementation(() => {});

      const result = save(fakeProgression);

      await expect(result).rejects.toBeInstanceOf(TypeError);
    });
  });

  describe('findLast', () => {
    it('shoud find the last progression', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      AsyncStorage.getItem = jest.fn().mockImplementation(() => null);
      const result = await findLast('tata', 'toto');
      expect(result).toEqual(null);
    });

    it('shoud find the last progression -- without retrieved progression', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');

      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');

      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
          statusText: 'Fetch Forbidden',
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
      const AsyncStorage = require('@react-native-community/async-storage');

      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const engine = ENGINE.LEARNER;
      const progressionContent = {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
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
      const {buildCompletionKey} = require('./progressions');

      expect(buildCompletionKey('hey', 'ho')).toBeDefined();
    });

    it('should map a progression to a completion -- with provided total', () => {
      const {mapProgressionToCompletion} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeState = createState({
        stars: 22,
        step: {
          current: 20
        }
      });
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
      const {mapProgressionToCompletion} = require('./progressions');

      const progressionId = 'fakeProgressionId';
      const fakeState = createState({
        stars: 22,
        step: {
          current: 20
        }
      });
      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
      const {mapProgressionToCompletion} = require('./progressions');

      const progressionId = 'fakeProgressionId';

      const fakeProgression = createProgression({
        _id: progressionId,
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
        }
      });

      expect(() => mapProgressionToCompletion(fakeProgression)).toThrow();
    });

    it('should merge two completion into a single one', () => {
      const {mergeCompletion} = require('./progressions');

      const completion1 = createCompletion({stars: 899, current: 33});
      const completion2 = createCompletion({stars: 898, current: 22});
      const result = mergeCompletion(completion1, completion2);
      const expectedResult = {stars: 899, current: 22};

      expect(result).toEqual(expectedResult);
    });

    it('should store the completion', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {storeOrReplaceCompletion} = require('./progressions');

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
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
      const AsyncStorage = require('@react-native-community/async-storage');
      const {storeOrReplaceCompletion} = require('./progressions');

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
        engine: ENGINE.LEARNER,
        progressionContent: {
          ref: 'foo',
          type: CONTENT_TYPE.CHAPTER
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
    const engineRef = ENGINE.LEARNER;
    const contentType: ContentType = CONTENT_TYPE.CHAPTER;
    const contentRef = 'fakeContentRef';
    const host = 'https://foo.coorpacademy.com';
    const token = createToken({
      host
    });
    const fooProgression = createProgression({
      _id: 'foo',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: contentRef,
        type: contentType
      },
      state: {
        stars: 13
      }
    });
    const barProgression = createProgression({
      _id: 'bar',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: contentRef,
        type: contentType
      },
      state: {
        stars: 37
      }
    });
    const bazProgression = createProgression({
      _id: 'bar',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: contentRef,
        type: contentType
      }
    });
    const quxProgression = createProgression({
      _id: 'qux',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: contentRef,
        type: contentType
      }
    });
    const storageKeys = [
      'progression_foo',
      'progression_bar',
      'progression_baz',
      'progression_qux',
      'baaaaz'
    ];

    it('should trigger error if no token is defined', () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

      const {findBestOf} = require('./progressions');

      const result = findBestOf(engineRef, contentType, contentRef, 'foo');

      expect(result).rejects.toThrow(Error);
    });

    it('should return default value', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${host}/api/v2/progressions/${engineRef}/bestof/${contentType}/${contentRef}`
        );
        expect(options.headers).toEqual({
          Authorization: token,
          'X-Requested-With': 'XMLHttpRequest'
        });

        return Promise.resolve({
          json: () => Promise.resolve({})
        });
      });

      AsyncStorage.getItem.mockImplementationOnce(key => {
        expect(key).toEqual('@@token');

        return Promise.resolve(token);
      });

      AsyncStorage.getAllKeys.mockImplementationOnce(() => Promise.resolve(storageKeys));
      AsyncStorage.multiGet.mockImplementationOnce(keys => {
        expect(keys).toEqual(storageKeys.slice(0, 4));

        return Promise.resolve([]);
      });

      const {findBestOf} = require('./progressions');

      const result = await findBestOf(engineRef, contentType, contentRef, 'foo');
      const expected: FindBestOfResult = {
        stars: 0
      };

      expect(result).toEqual(expected);
    });

    it('should return stars from local progressions', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${host}/api/v2/progressions/${engineRef}/bestof/${contentType}/${contentRef}`
        );
        expect(options.headers).toEqual({
          Authorization: token,
          'X-Requested-With': 'XMLHttpRequest'
        });

        return Promise.resolve({
          json: () => Promise.resolve({})
        });
      });

      AsyncStorage.getItem.mockImplementationOnce(key => {
        expect(key).toEqual('@@token');

        return Promise.resolve(token);
      });

      AsyncStorage.getAllKeys.mockImplementationOnce(() => Promise.resolve(storageKeys));
      AsyncStorage.multiGet.mockImplementationOnce(keys => {
        expect(keys).toEqual([
          'progression_foo',
          'progression_bar',
          'progression_baz',
          'progression_qux'
        ]);

        return Promise.resolve([
          ['progression_foo', JSON.stringify(fooProgression)],
          ['progression_bar', JSON.stringify(barProgression)],
          ['progression_baz', JSON.stringify(bazProgression)],
          ['progression_qux', JSON.stringify(quxProgression)]
        ]);
      });

      const {findBestOf} = require('./progressions');

      const result = await findBestOf(engineRef, contentType, contentRef, 'quuux');
      const expected: FindBestOfResult = {
        stars: 37
      };

      expect(result).toEqual(expected);
    });

    it('should return stars from api', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(
          `${host}/api/v2/progressions/${engineRef}/bestof/${contentType}/${contentRef}`
        );
        expect(options.headers).toEqual({
          Authorization: token,
          'X-Requested-With': 'XMLHttpRequest'
        });

        return Promise.resolve({
          json: () =>
            Promise.resolve({
              stars: 1337
            })
        });
      });

      AsyncStorage.getItem.mockImplementationOnce(key => {
        expect(key).toEqual('@@token');

        return Promise.resolve(token);
      });

      AsyncStorage.getAllKeys.mockImplementationOnce(() => Promise.resolve(storageKeys));
      AsyncStorage.multiGet.mockImplementationOnce(keys => {
        expect(keys).toEqual([
          'progression_foo',
          'progression_bar',
          'progression_baz',
          'progression_qux'
        ]);

        return Promise.resolve([
          ['progression_foo', JSON.stringify(fooProgression)],
          ['progression_bar', JSON.stringify(barProgression)],
          ['progression_baz', JSON.stringify(bazProgression)],
          ['progression_qux', JSON.stringify(quxProgression)]
        ]);
      });

      const {findBestOf} = require('./progressions');

      const result = await findBestOf(engineRef, contentType, contentRef, 'quux');
      const expected: FindBestOfResult = {
        stars: 1337
      };

      expect(result).toEqual(expected);
    });
  });
});
