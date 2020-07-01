import {PROGRESSION_CREATE_SUCCESS} from '@coorpacademy/player-store';
import {offlineActionTypes} from 'react-native-offline';

import {createBrand} from '../../__fixtures__/brands';
import {createAuthenticationState} from '../../__fixtures__/store';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import {synchronizeProgressions} from '../actions/progressions/synchronize';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';
import createMiddleware from './progressions-synchronization';

const brand = createBrand();
const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
});

describe("Progression's synchronization middleware", () => {
  const options: Options = {
    // @ts-ignore we dont want to mock the entire services object
    services: {
      Progression: {},
    },
  };

  it('shoud not handle unsupported action', () => {
    const action = {
      type: 'FOO',
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    const next = jest.fn();

    store.getState.mockImplementation(() => ({
      authentication: createAuthenticationState({token: 'FAKE_TOKEN', brand}),
    }));

    // @ts-ignore this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  const testRunner = (action) => {
    it(`should dispatch syncrhonizeProgression ${action.type}`, async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      store.getState.mockImplementation(() => ({
        authentication: createAuthenticationState({token: 'FAKE_TOKEN', brand}),
      }));
      const next = jest.fn();

      // @ts-ignore this si to test only
      middleware(store)(next)(action);
      await sleep();

      if (action.type === offlineActionTypes.CONNECTION_CHANGE && !action.payload) {
        expect(store.dispatch).toHaveBeenCalledTimes(0);
      } else {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(synchronizeProgressions);
      }
      expect(next).toHaveBeenCalledWith(action);
    });
  };

  const scenarios = [
    {
      type: PROGRESSION_CREATE_SUCCESS,
    },
    {
      type: FETCH_SECTIONS_SUCCESS,
    },
    {
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: true,
    },
    {
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: false,
    },
  ];

  scenarios.forEach(testRunner);
});
