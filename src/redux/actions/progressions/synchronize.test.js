// @flow strict

import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createBrand} from '../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../__fixtures__/store';
import {createProgression} from '../../../__fixtures__/progression';
import {synchronizeProgressions, synchronizeProgression} from './synchronize';

const brand = createBrand();

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  selectProgression: jest.fn(id =>
    Promise.resolve({type: '@@mock/SELECT_PROGRESSION', payload: {id}})
  ),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
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

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };
      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
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

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(actual).toBeUndefined();
    });
    it('should skip inProgress progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

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
          getAll: jest.fn()
        }
      };

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

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });
    it('should synchronize failed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });
  });
  describe('synchronizeProgression', () => {
    it('should synchronize progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_'})
      });

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_SUCCESS',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve(successProgression);
      });

      services.Progressions.synchronize.mockImplementationOnce((token, host, progression) => {
        expect(progression).toBe(successProgression);
        return Promise.resolve(progression);
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_SUCCESS',
        meta: {id: successProgression._id}
      });
    });
    it("should fail if progression doesn't exist", async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_'}),
        brand
      });

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_SUCCESS',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve();
      });

      services.Progressions.synchronize.mockImplementationOnce((toke, host, progression) => {
        expect(progression).toBe(successProgression);
        return Promise.resolve(progression);
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(0);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_SUCCESS',
        meta: {id: successProgression._id}
      });
    });
    it('should fail if synchronization failed', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.getState.mockReturnValue({
        authentication: createAuthenticationState({token: '_TOKEN_', brand})
      });

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_FAILURE',
          error: true,
          payload: new Error('Synchronization failed'),
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve(successProgression);
      });

      services.Progressions.synchronize.mockImplementationOnce((token, host, progression) => {
        expect(progression).toBe(successProgression);
        return Promise.reject(new Error('Synchronization failed'));
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_FAILURE',
        error: true,
        payload: new Error('Synchronization failed'),
        meta: {id: successProgression._id}
      });
    });
    it('token is missing', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_FAILURE',
          error: true,
          payload: new Error('Token not defined'),
          meta: {id: successProgression._id}
        });
        return action;
      });
      getState.mockReturnValue({
        authentication: {token: null, brand: null}
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_FAILURE',
        error: true,
        payload: new Error('Token not defined'),
        meta: {id: successProgression._id}
      });
    });
    it('brand is missing', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Cards: {
            find: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_FAILURE',
          error: true,
          payload: new TypeError('Brand not defined'),
          meta: {id: successProgression._id}
        });
        return action;
      });
      getState.mockReturnValue({
        authentication: createAuthenticationState({
          brand: null
        })
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      expect(options.services.Cards.find).not.toHaveBeenCalled();
      return expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_FAILURE',
        error: true,
        payload: new Error('Brand not defined'),
        meta: {id: successProgression._id}
      });
    });
  });
});
