import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createBrand} from '../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../__fixtures__/store';
import {createProgression} from '../../../__fixtures__/progression';
import {ForbiddenError, ConflictError} from '../../../models/error';
import {
  synchronizeProgression,
  synchronizeProgressions,
  SYNCHRONIZE_REQUEST,
  SYNCHRONIZE_SUCCESS,
  SYNCHRONIZE_FAILURE,
  SYNCHRONIZE_ALL_REQUEST,
  SYNCHRONIZE_ALL_SUCCESS,
  SYNCHRONIZE_ALL_FAILURE,
} from './synchronize';

const brand = createBrand();

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  selectProgression: jest.fn((id) =>
    Promise.resolve({type: '@@mock/SELECT_PROGRESSION', payload: {id}}),
  ),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'},
}));

jest.mock('delay', () => ({
  __esModule: true,
  default: () => Promise.resolve(),
}));

describe('Progressions synchronization', () => {
  const inProgressProgression = createProgression({
    _id: 'inProgressProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL,
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'sli_1',
      },
    },
  });
  const successProgression = createProgression({
    _id: 'successProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL,
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SUCCESS,
        ref: 'suc_1',
      },
    },
  });
  const failureProgression = createProgression({
    _id: 'failureProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL,
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1',
      },
    },
  });
  const wihoutIdProgression = createProgression({
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL,
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1',
      },
    },
  });

  describe('synchronizeProgressions', () => {
    it('should synchronize only finished progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
        brand,
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_SUCCESS].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([
          inProgressProgression,
          successProgression,
          failureProgression,
          wihoutIdProgression,
        ]),
      );

      services.Progressions.synchronize.mockImplementationOnce(() => Promise.resolve(undefined));

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(2);
      expect(innerDispatch).toHaveBeenCalledTimes(4);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        successProgression._id,
        failureProgression._id,
      ]);
      expect(store.dispatch).toHaveBeenCalledTimes(4);
    });

    it('should skip synchronize progression if it has been already posted', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
        brand,
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) =>
            Promise.resolve(successProgression),
          ),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_SUCCESS].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression]),
      );

      services.Progressions.synchronize.mockImplementationOnce(() => Promise.resolve(undefined));

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(0);
      expect(innerDispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        successProgression._id,
      ]);
      expect(store.dispatch).toHaveBeenCalledTimes(3);
    });

    it('should skip progression already synchronized', async () => {
      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => [successProgression._id]),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(2);

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(0);
    });

    it('should skip inProgress progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([inProgressProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(0);
    });

    it('should skip progression without _id', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([wihoutIdProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(0);
    });

    it('should synchronize successed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_SUCCESS].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(innerDispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        successProgression._id,
      ]);
    });

    it('should synchronize failed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_SUCCESS].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_SUCCESS);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(innerDispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        failureProgression._id,
      ]);
    });

    it('Token is undefined', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: null, brand}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      // @ts-ignore not valid callable signature
      const synchronization = synchronizeProgression('fakeProgressionId', successProgression)(
        store.dispatch,
        store.getState,
        // @ts-ignore missing some services
        {services},
      );

      await expect(synchronization).rejects.toThrowError(TypeError('Token not defined'));
    });

    it('Brand is undefined', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: 'FAKE_TOKEN', brand: null}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      // @ts-ignore not valid callable signature
      const synchronization = synchronizeProgression('fakeProgressionId', successProgression)(
        store.dispatch,
        store.getState,
        // @ts-ignore missing some services
        {services},
      );

      await expect(synchronization).rejects.toThrowError(TypeError('Brand not defined'));
    });

    it('should skip if synchronizing', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
        brand,
        progressions: {isSynchronizing: true},
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(),
        },
      };

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(0);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(0);
    });
  });

  describe('Synchronization fail', () => {
    it('should fail to synchronize after 5 tries ', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(() => Promise.reject(new ForbiddenError('Something bad happened'))),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_FAILURE].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_FAILURE);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(innerDispatch).toHaveBeenCalledTimes(12);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(6);
    });

    it('should fail to synchronize if an error has occured ', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(() => Promise.reject(new Error('Network error'))),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_FAILURE].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_FAILURE);
          return Promise.resolve(action);
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression]),
      );

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(innerDispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
    });

    it('should handle conflict error and consider progression as synchronized', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
      };

      const barProgression = {
        ...failureProgression,
        _id: 'bar',
      };
      const bazProgression = {
        ...successProgression,
        _id: 'baz',
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
      });

      const services = {
        Progressions: {
          getAll: jest
            .fn()
            .mockImplementation(() => Promise.resolve([bazProgression, barProgression])),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve(['foo'])),
          updateSynchronizedProgressionIds: jest.fn(),
          findRemoteProgressionById: jest.fn((token, host, progressionId) => Promise.resolve(null)),
          synchronize: jest.fn().mockImplementation((token, host, progrssion) => {
            expect(token).toBeDefined();
            expect(host).toBeDefined();
            if (progrssion._id === 'baz') {
              return Promise.reject(new ConflictError('Duplicated resource'));
            }
            return Promise.reject(new Error('Network error'));
          }),
        },
      };

      const innerDispatch = jest.fn().mockImplementation((action) => {
        if ([SYNCHRONIZE_REQUEST, SYNCHRONIZE_FAILURE].includes(action.type)) {
          return Promise.resolve(action);
        }
        return Promise.resolve();
      });

      store.dispatch
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_REQUEST);
          return Promise.resolve(action);
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((actionFn) => {
          // @ts-ignore
          return actionFn(innerDispatch, store.getState, {services});
        })
        .mockImplementationOnce((action) => {
          expect(action.type).toEqual(SYNCHRONIZE_ALL_FAILURE);
          return Promise.resolve(action);
        });

      AsyncStorage.setItem = jest.fn().mockImplementation((key, value) => {
        expect(key).toBe('synchronized_progressions');
        expect(JSON.parse(value)).toEqual(['foo', 'baz']);
      });

      // @ts-ignore
      await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(4);
      expect(innerDispatch).toHaveBeenCalledTimes(4);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        'foo',
        'baz',
      ]);
    });
  });
});
