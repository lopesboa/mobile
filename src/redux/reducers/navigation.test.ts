import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action} from '../actions/navigation';
import reducer from './navigation';
import type {State} from './navigation';

describe('Navigation', () => {
  const expectedInitialState: State = {
    currentNavigatorName: 'App',
    currentAppScreenName: 'Authentication',
    currentScreenName: 'Authentication',
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(NAVIGATION_SCREEN_CHANGE, () => {
    it('Default', () => {
      const action: Action = {
        type: NAVIGATION_SCREEN_CHANGE,
        payload: {
          currentNavigatorName: 'Foo',
          currentAppScreenName: 'Bar',
          currentScreenName: 'Baz',
          currentTabName: 'Qux',
        },
      };
      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        currentNavigatorName: 'Foo',
        currentAppScreenName: 'Bar',
        currentScreenName: 'Baz',
        currentTabName: 'Qux',
      };
      expect(result).toEqual(expected);
    });
  });
});
