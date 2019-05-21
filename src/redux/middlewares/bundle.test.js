// @flow strict

import {CARD_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline, BundledChapter} from '../../layer/data/_types';
import {createDiscipline} from '../../__fixtures__/disciplines';
import {createChapter} from '../../__fixtures__/chapters';
import {createBrand} from '../../__fixtures__/brands';
import {FETCH_REQUEST, FETCH_SUCCESS, FETCH_ERROR} from '../actions/bundle';
import type {Action} from '../actions/bundle';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import createMiddleware from './bundle';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

const brand = createBrand();
const discipline = createDiscipline({ref: 'foobarbaz', levels: [], name: 'Foo bar baz'});
const chapter = createChapter({ref: 'foobarbazqux', name: 'Foo bar baz qux'});
const disciplineBundle: BundledDiscipline = {
  disciplines: {
    foobarbaz: discipline
  },
  chapters: {
    foobarbazqux: chapter
  },
  slides: {},
  exitNodes: {},
  chapterRules: {}
};
const chapterBundle: BundledChapter = {
  chapters: {
    foobarbazqux: chapter
  },
  slides: {},
  exitNodes: {},
  chapterRules: {}
};

describe('Bundle', () => {
  const options: Options = {
    // $FlowFixMe we dont want to mock the entire services object
    services: {
      Bundle: {
        findById: jest.fn(() => Promise.reject(new Error('Fake error'))),
        store: jest.fn(() => Promise.reject(new Error('Fake error')))
      }
    }
  };

  it('shoud not handle unsupported action', () => {
    const action = {
      type: 'FOO'
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  describe(FETCH_REQUEST, () => {
    const action: Action = {
      type: FETCH_REQUEST,
      payload: {
        type: CARD_TYPE.COURSE,
        ref: 'foobarbaz',
        languages: ['en', 'de']
      }
    };

    it('should handle empty payload', async () => {
      const emptyAction = {
        ...action,
        payload: {}
      };
      const middleware = createMiddleware(options);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: brand}
      }));
      const next = jest.fn();
      // $FlowFixMe this si to test only
      middleware(store)(next)(emptyAction);
      await sleep();
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: {
          type: undefined,
          ref: undefined,
          languages: undefined
        }
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(emptyAction);
    });

    it('should handle findById rejection', async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: brand}
      }));
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: {
          type: CARD_TYPE.COURSE,
          ref: 'foobarbaz',
          languages: ['en', 'de']
        }
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should handle if token is not defined', async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: brand}
      }));
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: {
          type: CARD_TYPE.COURSE,
          ref: 'foobarbaz',
          languages: ['en', 'de']
        }
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should fetch a discipline bundle', async () => {
      // $FlowFixMe we dont want to mock the entire services object
      const extendedOptions: Options = {
        services: {
          Bundle: {
            ...options.services.Bundle,
            findById: jest.fn(() => Promise.resolve(disciplineBundle)),
            store: jest.fn(() => Promise.resolve())
          }
        }
      };
      const middleware = createMiddleware(extendedOptions);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: brand}
      }));
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedAction: Action = {
        type: FETCH_SUCCESS,
        payload: {
          disciplines: {
            foobarbaz: ['en', 'de']
          },
          chapters: {
            foobarbazqux: ['en', 'de']
          }
        }
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should fetch a chapter bundle', async () => {
      // $FlowFixMe we dont want to mock the entire services object
      const extendedOptions: Options = {
        services: {
          Bundle: {
            ...options.services.Bundle,
            findById: jest.fn(() => Promise.resolve(chapterBundle)),
            store: jest.fn(() => Promise.resolve())
          }
        }
      };
      const middleware = createMiddleware(extendedOptions);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: {user: {token: '__TOKEN__', isGodModeUser: false}, brand: brand}
      }));
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedAction: Action = {
        type: FETCH_SUCCESS,
        payload: {
          disciplines: {},
          chapters: {
            foobarbazqux: ['en', 'de']
          }
        }
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
