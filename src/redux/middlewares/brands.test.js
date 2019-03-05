// @flow strict

import {createBrand} from '../../__fixtures__/brands';
import {
  fetchRequest,
  fetchSuccess,
  fetchError,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR
} from '../actions/brands';
import type {Action} from '../actions/brands';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import createMiddleware from './brands';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

const TOKEN = '__TOKEN__';
const BRAND = createBrand();

describe('Cards', () => {
  const options: Options = {
    // $FlowFixMe we dont want to mock the entire services object
    services: {
      Cards: {
        find: jest.fn(() => Promise.reject(new Error('Fake error')))
      },
      // $FlowFixMe we dont want to mock the entire services object
      Content: {
        find: jest.fn(() => Promise.reject(new Error('Fake error')))
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

  describe(FETCH_ERROR, () => {
    it("shouldn't handle fetch rejection", () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();

      const action: Action = fetchError('error');
      const expectedAction = action;
      middleware(store)(next)(action);
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe(FETCH_SUCCESS, () => {
    it("shouldn't handle fetch resolve", () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();

      const action: Action = fetchSuccess(BRAND, TOKEN);
      const expectedAction = action;
      middleware(store)(next)(action);
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe(FETCH_REQUEST, () => {
    it('should fetch cards', async () => {
      // $FlowFixMe we dont want to mock the entire services object
      const extendedOptions: Options = {
        services: {
          Brands: {
            ...options.services.Brands,
            find: jest.fn(() => Promise.resolve(BRAND))
          }
        }
      };
      const middleware = createMiddleware(extendedOptions);
      const store = createStore();
      const next = jest.fn();

      const action: Action = fetchRequest(TOKEN);
      const expectedSuccessAction: Action = fetchSuccess(BRAND, TOKEN);
      middleware(store)(next)(action);
      await sleep();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(expectedSuccessAction);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
  it('should fetch cards with error', async () => {
    // $FlowFixMe we dont want to mock the entire services object
    const extendedOptions: Options = {
      services: {
        Brands: {
          ...options.services.Brands,
          find: jest.fn(() => Promise.reject(new Error('failed')))
        }
      }
    };
    const middleware = createMiddleware(extendedOptions);
    const store = createStore();
    const next = jest.fn();

    const action: Action = fetchRequest(TOKEN);
    const expectedErrorAction: Action = fetchError(new Error('failed').toString());
    middleware(store)(next)(action);
    await sleep();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(expectedErrorAction);
    expect(next).toHaveBeenCalledWith(action);
  });
});
