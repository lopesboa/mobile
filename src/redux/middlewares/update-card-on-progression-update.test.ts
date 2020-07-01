import {PROGRESSION_UPDATED_ON_MOVE, PROGRESSION_UPDATED_ON_NODE} from '@coorpacademy/player-store';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import createMiddleware from './update-card-on-progression-update';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
});

describe('UpdateCard on ProgressionUpdate middleware', () => {
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
    // @ts-ignore this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should dispatch PROGRESSION_UPDATED_ON_MOVE on move action', async () => {
    const updateProgressionAction = {
      type: PROGRESSION_UPDATED_ON_MOVE,
      meta: {
        id: 'lol',
      },
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    const next = jest.fn();
    middleware(store)(next)(updateProgressionAction);
    await sleep();

    expect(store.dispatch).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(updateProgressionAction);
  });

  it('should dispatch PROGRESSION_UPDATED_ON_NODE on node action', async () => {
    const updateProgressionAction = {
      type: PROGRESSION_UPDATED_ON_NODE,
      meta: {
        id: 'lol',
      },
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
