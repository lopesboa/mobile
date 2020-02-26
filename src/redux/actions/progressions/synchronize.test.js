// @flow

import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createBrand} from '../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../__fixtures__/store';
import {createProgression} from '../../../__fixtures__/progression';
import {ForbiddenError, ConflictError} from '../../../models/error';
import {synchronizeProgressions, SYNCHRONIZE_SUCCESS, SYNCHRONIZE_FAILURE} from './synchronize';

const brand = createBrand();

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  selectProgression: jest.fn(id =>
    Promise.resolve({type: '@@mock/SELECT_PROGRESSION', payload: {id}})
  ),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

jest.mock('delay', () => ({
  __esModule: true,
  default: () => Promise.resolve()
}));

describe('Progressions synchronization', () => {
  const inProgressProgression = createProgression({
    _id: 'inProgressProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'sli_1'
      }
    }
  });
  const successProgression = createProgression({
    _id: 'successProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SUCCESS,
        ref: 'suc_1'
      }
    }
  });
  const failureProgression = createProgression({
    _id: 'failureProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1'
      }
    }
  });
  const wihoutIdProgression = createProgression({
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1'
      }
    }
  });
  describe('synchronizeProgressions', () => {
    it('should synchronize only finished progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand}),
        brand
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updateSynchronizedProgressionIds: jest.fn(),
          updatePendingProgressionId: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([
          inProgressProgression,
          successProgression,
          failureProgression,
          wihoutIdProgression
        ])
      );

      services.Progressions.synchronize.mockImplementationOnce(() => Promise.resolve(undefined));

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        failureProgression._id,
        successProgression._id
      ]);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(actual).toBeUndefined();
    });

    it('should skip progression already synchronized', async () => {
      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => [successProgression._id]),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(0);

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(0);
      expect(actual).toBeUndefined();
    });

    it('should skip inProgress progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([inProgressProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(actual).toBeUndefined();
    });

    it('should skip progression without _id', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([wihoutIdProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(actual).toBeUndefined();
    });

    it('should synchronize successed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        successProgression._id
      ]);

      expect(actual).toBeUndefined();
    });

    it('should synchronize failed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);

      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        failureProgression._id
      ]);

      expect(actual).toBeUndefined();
    });

    it('Token is undefined', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: null, brand})
      });
      // $FlowFixMe
      const result = synchronizeProgressions(store.dispatch, store.getState, {services: {}});
      await expect(result).rejects.toThrow('Token not defined');
    });

    it('Brand is undefined', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: 'FAKE_TOKEN', brand: null})
      });
      // $FlowFixMe
      const result = synchronizeProgressions(store.dispatch, store.getState, {services: {}});

      await expect(result).rejects.toThrow('Brand not defined');
    });
  });
  describe('Synchronization fail', () => {
    it('should fail to synchronize after 5 tries ', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(() => Promise.reject(new ForbiddenError('Something bad happened')))
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_FAILURE);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(6);
      expect(actual).toBeUndefined();
    });

    it('should fail to synchronize if an error has occured ', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn(() => Promise.reject(new Error('Network error')))
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_FAILURE);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });

    it('should handle conflict error and consider progression as synchronized', async () => {
      const AsyncStorage = require('@react-native-community/async-storage');
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const barProgression = {
        ...failureProgression,
        _id: 'bar'
      };
      const bazProgression = {
        ...successProgression,
        _id: 'baz'
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      const services = {
        Progressions: {
          getAll: jest
            .fn()
            .mockImplementation(() => Promise.resolve([bazProgression, barProgression])),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve(['foo'])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn().mockImplementation((token, host, progrssion) => {
            expect(token).toBeDefined();
            expect(host).toBeDefined();
            if (progrssion._id === 'baz') {
              return Promise.reject(new ConflictError('Duplicated resource'));
            }
            return Promise.reject(new Error('Network error'));
          })
        }
      };

      store.dispatch
        .mockImplementationOnce(action => {
          expect(action.type).toEqual(SYNCHRONIZE_FAILURE);
          return Promise.resolve(action);
        })
        .mockImplementationOnce(action => {
          expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
          return Promise.resolve(action);
        });
      AsyncStorage.setItem = jest.fn().mockImplementation((key, value) => {
        expect(key).toBe('synchronized_progressions');
        expect(JSON.parse(value)).toEqual(['foo', 'baz']);
      });

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(2);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledWith([
        'foo',
        'baz'
      ]);
      expect(actual).toBeUndefined();
    });
  });

  describe('Synchronize pending', () => {
    it('should sync progression if it is not pending', async () => {
      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve('')),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);

      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });

    it('should treat progression as synced if it is pending and has been already posted', async () => {
      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve(successProgression._id)),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(successProgression)),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.updatePendingProgressionId.mockImplementation(value => {
        expect(value).toBe('');
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);

      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(0);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updatePendingProgressionId).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });

    it('should treat progression as not synced if it is pending and has not been already posted', async () => {
      const services = {
        Progressions: {
          getAll: jest.fn(),
          getSynchronizedProgressionIds: jest.fn(() => Promise.resolve([])),
          getPendingProgressionId: jest.fn(() => Promise.resolve(successProgression._id)),
          findRemoteProgressionById: jest.fn(() => Promise.resolve(null)),
          updatePendingProgressionId: jest.fn(),
          updateSynchronizedProgressionIds: jest.fn(),
          synchronize: jest.fn()
        }
      };

      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementation(action => {
        expect(action.type).toEqual(SYNCHRONIZE_SUCCESS);
        return Promise.resolve(action);
      });

      services.Progressions.updatePendingProgressionId
        .mockImplementationOnce(value => {
          expect(value).toBe(successProgression._id);
        })
        .mockImplementationOnce(value => {
          expect(value).toBe('');
        });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);

      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updateSynchronizedProgressionIds).toHaveBeenCalledTimes(1);
      expect(services.Progressions.updatePendingProgressionId).toHaveBeenCalledTimes(2);
      expect(actual).toBeUndefined();
    });
  });
});
