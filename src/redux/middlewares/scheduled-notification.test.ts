import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import {sleep} from '../../utils/tests';
import createMiddleware from './scheduled-notification';

const createStore = () => ({
  getState: jest.fn(() => ({navigation: {currentScreenName: 'Slide'}})),
  dispatch: jest.fn(),
});

describe('Schedule notifications', () => {
  it('shoud not handle unsupported action', () => {
    const action = {
      type: 'FOO',
    };
    const middleware = createMiddleware();
    const store = createStore();
    const next = jest.fn();
    // @ts-ignore this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatch dispatches the scheduleNotifications action', async () => {
    const gotoHomeAction = {
      type: NAVIGATION_SCREEN_CHANGE,
      payload: {
        currentScreenName: 'Home',
      },
    };
    const middleware = createMiddleware();
    const store = createStore();
    const next = jest.fn();
    // @ts-ignore this si to test only
    middleware(store)(next)(gotoHomeAction);
    await sleep();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(gotoHomeAction);
  });
});
