// @flow

import type {ContentType, Progression} from '@coorpacademy/progression-engine';

import {createProgression, createState, createAction} from '../../__fixtures__/progression';
import createCompletion from '../../__fixtures__/completion';
import {createToken} from '../../__fixtures__/tokens';
import {ForbiddenError} from '../../models/error';
import {CONTENT_TYPE, ENGINE, SPECIFIC_CONTENT_REF} from '../../const';
import {OLDEST_DATE} from '../../utils/progressions';
import {extractErrorName} from '../../utils/tests';
import type {HeroRecommendation} from './_types';
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
    it('should the progression and the last progression id simultaneously', async () => {
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

    it('should add createAt in each action', async () => {
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

    it('should throw on progression without _id', async () => {
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
    it('should find the last progression', async () => {
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

    it('should find the last progression -- without retrieved progression id', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const {findLast} = require('./progressions');

      AsyncStorage.getItem = jest.fn().mockImplementation(() => null);
      const result = await findLast('tata', 'toto');
      expect(result).toEqual(null);
    });

    it('should find the last progression -- without retrieved progression', async () => {
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

    it('should find the last progression -- with success as nextContent type', async () => {
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
        type: CONTENT_TYPE.SUCCESS
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

    it('should find the last progression -- with failure as nextContent type', async () => {
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

    it('should find the last progression -- with node as nextContent type and extralife as ref', async () => {
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
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
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
        throw new ForbiddenError('Fetch Forbidden');
      });

      AsyncStorage.removeItem = jest.fn().mockImplementation(keys => {
        expect(keys).toEqual(`progression_${progressionId}`);
        return Promise.resolve();
      });

      const {synchronize} = require('./progressions');
      await expect(extractErrorName(synchronize(TOKEN, HOST, fakeProgression))).resolves.toEqual(
        'ForbiddenError'
      );
    });

    it('should throw error 403', async () => {
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
          statusText: 'Foo bar baz',
          json: () => Promise.resolve({})
        });
      });

      const {synchronize} = require('./progressions');
      await expect(extractErrorName(synchronize(TOKEN, HOST, fakeProgression))).resolves.toEqual(
        'ForbiddenError'
      );
    });

    it('should throw error 409', async () => {
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
          status: 409,
          statusText: 'Foo bar baz',
          json: () => Promise.resolve({})
        });
      });

      const {synchronize} = require('./progressions');
      await expect(extractErrorName(synchronize(TOKEN, HOST, fakeProgression))).resolves.toEqual(
        'ConflictError'
      );
    });

    it('should throw error 406', async () => {
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
          status: 406,
          statusText: 'Foo bar baz',
          json: () => Promise.resolve({})
        });
      });

      const {synchronize} = require('./progressions');
      await expect(extractErrorName(synchronize(TOKEN, HOST, fakeProgression))).resolves.toEqual(
        'NotAcceptableError'
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
      await expect(extractErrorName(synchronize(TOKEN, HOST, fakeProgression))).resolves.toEqual(
        'Error'
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
      // $FlowFixMe fakeProgression does not need meta for this test
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
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
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
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
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
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
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

  describe('findApiBestOf', () => {
    const engineRef = ENGINE.LEARNER;
    const contentType: ContentType = CONTENT_TYPE.CHAPTER;
    const contentRef = 'fakeContentRef';

    beforeAll(() => {
      jest.resetModules();
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
    });

    it('should return default value', async () => {
      const {findApiBestOf} = require('./progressions');

      const result = await findApiBestOf(engineRef, contentType, contentRef);
      const expected: FindBestOfResult = {
        stars: 0
      };

      expect(result).toEqual(expected);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });
  });
});

const mockProgressionsStorage = (progressions: Array<Progression>) => {
  const AsyncStorage = require('@react-native-community/async-storage');

  AsyncStorage.getAllKeys = jest
    .fn()
    .mockImplementation(() => Promise.resolve(progressions.map(p => `progression_${p._id || ''}`)));

  AsyncStorage.multiGet = jest
    .fn()
    .mockImplementation(keys =>
      Promise.resolve(progressions.map(p => [`progression_${p._id || ''}`, JSON.stringify(p)]))
    );
};

describe('aggregation by content', () => {
  it('should get aggregate 2 progressions with same content, and set an old date when no actions', async () => {
    const progression1 = createProgression({
      _id: 'progression1',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      }
    });

    const progression2 = createProgression({
      _id: 'progression2',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 12
        }
      }
    });

    const progressions = [progression1, progression2];
    mockProgressionsStorage(progressions);

    const {getAggregationsByContent} = require('./progressions');
    const result = await getAggregationsByContent();
    const expected: Array<HeroRecommendation> = [
      {
        progressionId: 'progression2',
        content: {version: '1', ref: 'foo', type: CONTENT_TYPE.CHAPTER},
        // $FlowFixMe state.step IS defined
        nbSlides: progression2.state.step.current - 1,
        success: true,
        updatedAt: OLDEST_DATE
      }
    ];

    expect(result).toEqual(expected);
  });

  it('should aggregate many progressions with different contents', async () => {
    const progression1 = createProgression({
      _id: 'progression1',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 12
        }
      },
      actions: [
        createAction({createdAt: '2003-01-18T08:41:37.004Z'}),
        createAction({createdAt: '2002-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2001-09-18T08:41:37.004Z'})
      ]
    });

    const progression2 = createProgression({
      _id: 'progression2',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 13
        }
      },
      actions: [
        createAction({createdAt: '2004-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2005-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2006-01-18T08:41:37.004Z'})
      ]
    });

    const progression3 = createProgression({
      _id: 'progression3',
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        ref: 'bar',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: 'slide1',
          type: CONTENT_TYPE.SLIDE
        },
        step: {
          current: 13
        }
      },
      actions: [
        createAction({createdAt: '1994-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2000-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2007-01-18T08:41:37.004Z'})
      ]
    });

    const progression4 = createProgression({
      _id: 'progression2',
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        ref: 'bar',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: 'slide4',
          type: CONTENT_TYPE.SLIDE
        },
        step: {
          current: 5
        }
      },
      actions: [
        createAction({createdAt: '2002-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2003-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2004-01-18T08:41:37.004Z'})
      ]
    });

    const progressions = [progression1, progression2, progression3, progression4];
    mockProgressionsStorage(progressions);

    const {getAggregationsByContent} = require('./progressions');
    const result = await getAggregationsByContent();
    const expected: Array<HeroRecommendation> = [
      {
        progressionId: 'progression2',
        content: {version: '1', ref: 'foo', type: CONTENT_TYPE.CHAPTER},
        // $FlowFixMe state.step IS defined
        nbSlides: progression2.state.step.current - 1,
        success: true,
        // $FlowFixMe actions[2] IS defined
        updatedAt: progression2.actions[2].createdAt
      },
      {
        progressionId: 'progression3',
        content: {version: '1', ref: 'bar', type: CONTENT_TYPE.CHAPTER},
        // $FlowFixMe state.step IS defined
        nbSlides: progression3.state.step.current - 1,
        success: false,
        // $FlowFixMe actions[2] IS defined
        updatedAt: progression3.actions[2].createdAt
      }
    ];

    expect(result).toEqual(expected);
  });

  it('should set progressions with no actions as older than others', async () => {
    const progression0 = createProgression({
      _id: 'progression0',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 17
        }
      }
    });

    const progression1 = createProgression({
      _id: 'progression1',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 10
        }
      },
      actions: [
        createAction({createdAt: '2002-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2003-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2004-01-18T08:41:37.004Z'})
      ]
    });

    const progression2 = createProgression({
      _id: 'progression2',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'foo',
        type: CONTENT_TYPE.CHAPTER
      },
      state: {
        nextContent: {
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
          type: CONTENT_TYPE.SUCCESS
        },
        step: {
          current: 12
        }
      },
      actions: [
        createAction({createdAt: '2000-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2001-09-18T08:41:37.004Z'}),
        createAction({createdAt: '2002-01-18T08:41:37.004Z'})
      ]
    });

    const progressions = [progression0, progression1, progression2];
    // $FlowFixMe _id IS defined
    mockProgressionsStorage(progressions);

    const {getAggregationsByContent} = require('./progressions');
    const result = await getAggregationsByContent();
    const expected: Array<HeroRecommendation> = [
      {
        progressionId: 'progression1',
        content: {version: '1', ref: 'foo', type: CONTENT_TYPE.CHAPTER},
        // $FlowFixMe state.step IS defined
        nbSlides: progression1.state.step.current - 1,
        success: true,
        // $FlowFixMe actions[2] IS defined
        updatedAt: progression1.actions[2].createdAt
      }
    ];

    expect(result).toEqual(expected);
  });

  describe('synchronized progressions ids', () => {
    it('getSynchronizedProgressionIds to return stored list', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(['foo', 'bar', 'baz'])));

      const {getSynchronizedProgressionIds} = require('./progressions');
      const res = await getSynchronizedProgressionIds();
      const expected: Array<string> = ['foo', 'bar', 'baz'];

      expect(res).toEqual(expected);
    });

    it('getSynchronizedProgressionIds to return default = []', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(null));

      const {getSynchronizedProgressionIds} = require('./progressions');
      const res = await getSynchronizedProgressionIds();
      const expected = [];

      expect(res).toEqual(expected);
    });

    it('updateSynchronizedProgressionIds', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.setItem = jest.fn();

      const array = ['foo', 'bar', 'baz'];
      const {
        SYNCHRONIZED_PROGRESSIONS,
        updateSynchronizedProgressionIds
      } = require('./progressions');
      await updateSynchronizedProgressionIds(array);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        SYNCHRONIZED_PROGRESSIONS,
        JSON.stringify(array)
      );
    });
  });
  describe('pending progressions id', () => {
    it('getPendingProgressionId to return stored id', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve('foo'));

      const {getPendingProgressionId} = require('./progressions');
      const res: string = await getPendingProgressionId();
      const expected: string = 'foo';

      expect(res).toEqual(expected);
    });

    it('getPendingProgressionId to return empty string if there is no pendind progression', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(null));

      const {getPendingProgressionId} = require('./progressions');
      const res: string = await getPendingProgressionId();
      const expected: string = '';

      expect(res).toEqual(expected);
    });

    it('updatePendingProgressionId', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      AsyncStorage.setItem = jest.fn();

      const pendingProgressionId = 'bar';
      const {PENDING_PROGRESSION, updatePendingProgressionId} = require('./progressions');
      await updatePendingProgressionId(pendingProgressionId);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(PENDING_PROGRESSION, pendingProgressionId);
    });
  });

  describe('findRemoteProgressionById', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    const TOKEN = '__TOKEN__';
    const HOST = 'https://coorp.mobile.com';

    it('should throw an error if progressionId is empty', async () => {
      const {findRemoteProgressionById} = require('./progressions');
      await expect(findRemoteProgressionById(TOKEN, HOST, '')).rejects.toThrowError();
    });

    it('should return false if progression has not been successfully posted already (404 from server)', async () => {
      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(`${HOST}/api/v2/progressions/${progressionId}`);
        expect(options.method).toBe('GET');
        expect(options.headers).toEqual({
          Authorization: TOKEN,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
        });
        return Promise.resolve({
          status: 404,
          statusText: 'Not found'
        });
      });

      const {findRemoteProgressionById} = require('./progressions');
      await expect(findRemoteProgressionById(TOKEN, HOST, progressionId)).resolves.toBe(null);
    });

    it('should return throw an error if we get a bad request from the server (statusCode > 400 & !404)', async () => {
      const fetch = require('cross-fetch');

      const progressionId = 'fakeProgressionId';

      fetch.mockImplementationOnce((url, options) => {
        expect(url).toBe(`${HOST}/api/v2/progressions/${progressionId}`);
        expect(options.method).toBe('GET');
        expect(options.headers).toEqual({
          Authorization: TOKEN,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
        });
        return Promise.resolve({
          status: 400,
          statusText: 'Not found'
        });
      });

      const {findRemoteProgressionById} = require('./progressions');
      await expect(findRemoteProgressionById(TOKEN, HOST, progressionId)).rejects.toThrowError();
    });

    it('should return true if progression has been already successfully posted', async () => {
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
        expect(url).toBe(`${HOST}/api/v2/progressions/${progressionId}`);
        expect(options.method).toBe('GET');
        expect(options.headers).toEqual({
          Authorization: TOKEN,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Coorpacademy Mobile/0.0.0 CFNetwork/897.15 Darwin/17.5.0 (iPhone iOS/12.2)'
        });
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve(fakeProgression)
        });
      });

      const {findRemoteProgressionById} = require('./progressions');
      await expect(findRemoteProgressionById(TOKEN, HOST, progressionId)).resolves.toBe(
        fakeProgression
      );
    });
  });
});
