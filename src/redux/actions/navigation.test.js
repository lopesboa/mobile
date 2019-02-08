// @flow strict

import {
  NAVIGATION_SCREEN_CHANGE,
  NAVIGATION_SHOW,
  NAVIGATION_HIDE,
  changeScreen,
  showNavigation,
  hideNavigation
} from './navigation';
import type {Action} from './navigation';

describe('Navigation', () => {
  it('changeScreen', () => {
    const result = changeScreen('Foo', 'Bar', 'Baz', 'Qux');
    const expected: Action = {
      type: NAVIGATION_SCREEN_CHANGE,
      payload: {
        currentNavigatorName: 'Foo',
        currentAppScreenName: 'Bar',
        currentScreenName: 'Baz',
        currentTabName: 'Qux'
      }
    };
    expect(result).toEqual(expected);
  });

  it('showNavigation', () => {
    const result = showNavigation();
    const expected: Action = {
      type: NAVIGATION_SHOW
    };
    expect(result).toEqual(expected);
  });

  it('hideNavigation', () => {
    const result = hideNavigation();
    const expected: Action = {
      type: NAVIGATION_HIDE
    };
    expect(result).toEqual(expected);
  });
});
