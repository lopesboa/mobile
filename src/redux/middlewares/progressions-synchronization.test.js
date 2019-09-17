// @flow strict

import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import {createBrand} from '../../__fixtures__/brands';
import {createAuthenticationState} from '../../__fixtures__/store';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import {synchronizeProgressions} from '../actions/progressions/synchronize';
import createMiddleware from './progressions-synchronization';

const brand = createBrand();
const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

describe("Progression's synchronization middleware", () => {
  const options: Options = {
    // $FlowFixMe we dont want to mock the entire services object
    services: {
      Progression: {}
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

  it('should dispatch syncrhonizeProgression', async () => {
    const gotoHomeAction = {
      type: NAVIGATION_SCREEN_CHANGE,
      payload: {
        currentScreenName: 'Home'
      }
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    store.getState.mockImplementation(() => ({
      authentication: createAuthenticationState({brand})
    }));
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(gotoHomeAction);
    await sleep();

    const expectedAction = synchronizeProgressions;
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(next).toHaveBeenCalledWith(gotoHomeAction);
  });
});
