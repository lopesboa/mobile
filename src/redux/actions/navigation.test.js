// @flow strict

import {NAVIGATION_SCREEN_CHANGE, changeScreen} from './navigation';
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
});
