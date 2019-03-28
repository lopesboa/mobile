// @flow strict

import {UI_PROGRESSION_ACTION_TYPES} from '@coorpacademy/player-store';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import createMiddleware from './update-card-on-progression-update';

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
    const updateProgressionAction = {
      type: UI_PROGRESSION_ACTION_TYPES.PROGRESSION_UPDATED,
      meta: {
        id: 'lol'
      }
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    const next = jest.fn();
    middleware(store)(next)(updateProgressionAction);
    await sleep();

    expect(store.dispatch).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(updateProgressionAction);
  });
});
