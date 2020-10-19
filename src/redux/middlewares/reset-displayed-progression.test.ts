import {UI_PROGRESSION_ACTION_TYPES} from '@coorpacademy/player-store';
import type {SelectAction} from '@coorpacademy/player-store';
import {ACTION_NAME as NAVIGATION_SCREEN_CHANGE} from '../navigation';
import {createBrand} from '../../__fixtures__/brands';
import type {Options} from '../_types';
import {sleep} from '../../utils/tests';
import {createStoreState, createAuthenticationState} from '../../__fixtures__/store';
import {createProgression} from '../../__fixtures__/progression';
import createMiddleware from './reset-displayed-progression';

const brand = createBrand();
const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn(),
});

const SlideRef = 'dummySlideRef';
const progression = createProgression({
  engine: 'learner',
  progressionContent: {
    type: 'slide',
    ref: SlideRef,
  },
  state: {
    nextContent: {
      type: 'slide',
      ref: 'dummySlideRef',
    },
  },
});

const mockedStore = createStoreState({
  levels: [],
  disciplines: [],
  chapters: [],
  slides: [],
  progression,
  authentication: createAuthenticationState({brand}),
});

describe('Rest displayed Progression', () => {
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

  it('should handle empty payload', async () => {
    const gotoHomeAction = {
      type: NAVIGATION_SCREEN_CHANGE,
      payload: {
        currentScreenName: 'Home',
      },
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    store.getState.mockImplementation(() => mockedStore);
    const next = jest.fn();
    // @ts-ignore this si to test only
    middleware(store)(next)(gotoHomeAction);
    await sleep();
    const expectedAction: SelectAction = {
      type: UI_PROGRESSION_ACTION_TYPES.SELECT_PROGRESSION,
      payload: {
        id: '',
      },
    };
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(next).toHaveBeenCalledWith(gotoHomeAction);
  });
});
