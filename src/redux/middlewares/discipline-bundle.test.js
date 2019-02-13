// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../../__fixtures__/disciplines';
import {createChapter} from '../../__fixtures__/chapters';
import {FETCH_REQUEST, FETCH_SUCCESS, FETCH_ERROR} from '../actions/discipline-bundle';
import type {Action} from '../actions/discipline-bundle';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import createMiddleware from './discipline-bundle';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

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

describe('Discipline bundle', () => {
  const options: Options = {
    // $FlowFixMe we dont want to mock the entire services object
    services: {
      DisciplineBundle: {
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

  it('should handle empty payload', () => {
    const action = {
      type: FETCH_REQUEST
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
        ref: 'foobarbaz',
        languages: ['fr', 'de']
      }
    };

    it('should handle findById rejection', async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: FETCH_ERROR,
        payload: action.payload
      });
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should fetch the discipline bundle', async () => {
      // $FlowFixMe we dont want to mock the entire services object
      const extendedOptions: Options = {
        services: {
          DisciplineBundle: {
            ...options.services.DisciplineBundle,
            findById: jest.fn(() => Promise.resolve(disciplineBundle)),
            store: jest.fn(() => Promise.resolve())
          }
        }
      };
      const middleware = createMiddleware(extendedOptions);
      const store = createStore();
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: FETCH_SUCCESS,
        payload: {
          disciplines: {
            foobarbaz: ['fr', 'de']
          },
          chapters: {
            foobarbazqux: ['fr', 'de']
          }
        }
      });
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
