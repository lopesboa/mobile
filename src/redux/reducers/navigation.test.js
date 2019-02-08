// @flow strict

import {NAVIGATION_SCREEN_CHANGE, NAVIGATION_SHOW, NAVIGATION_HIDE} from '../actions/navigation';
import type {Action} from '../actions/navigation';
import reducer from './navigation';
import type {State} from './navigation';

describe('Navigation', () => {
  const expectedInitialState: State = {
    currentNavigatorName: 'App',
    currentAppScreenName: 'Home',
    isHidden: false
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
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
          currentTabName: 'Qux'
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        currentNavigatorName: 'Foo',
        currentAppScreenName: 'Bar',
        currentScreenName: 'Baz',
        currentTabName: 'Qux'
      };
      expect(result).toEqual(expected);
    });

    it('Without payload', () => {
      const action: Action = {
        type: NAVIGATION_SCREEN_CHANGE
      };
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
    });
  });

  it(NAVIGATION_SHOW, () => {
    const action: Action = {
      type: NAVIGATION_SHOW
    };
    const result = reducer({...expectedInitialState, isHidden: true}, action);
    const expected: State = {
      ...expectedInitialState,
      isHidden: false
    };
    expect(result).toEqual(expected);
  });

  it(NAVIGATION_HIDE, () => {
    const action: Action = {
      type: NAVIGATION_HIDE
    };
    const result = reducer({...expectedInitialState, isHidden: false}, action);
    const expected: State = {
      ...expectedInitialState,
      isHidden: true
    };
    expect(result).toEqual(expected);
  });
});
