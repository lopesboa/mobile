// @flow strict

import {TOGGLE_GOD_MODE} from '../actions/godmode';
import type {Action} from '../actions/godmode';
import reducer from './godmode';
import type {State} from './godmode';

describe('God mode', () => {
  const expectedInitialState: State = false;

  it('should return default state', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  it('should toggle godmode to true', () => {
    const action: Action = {
      type: TOGGLE_GOD_MODE,
      payload: true
    };
    const result = reducer(expectedInitialState, action);
    const expected: State = true;
    expect(result).toEqual(expected);
  });
});
