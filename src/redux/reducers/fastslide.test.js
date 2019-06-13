// @flow strict

import {TOGGLE_FAST_SLIDE} from '../actions/fastslide';
import type {Action} from '../actions/fastslide';
import reducer from './fastslide';
import type {State} from './fastslide';

describe('FastSlide', () => {
  const expectedInitialState: State = false;

  it('should return default state', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  it('should toggle fastslide to true', () => {
    const action: Action = {
      type: TOGGLE_FAST_SLIDE,
      payload: true
    };
    const result = reducer(expectedInitialState, action);
    const expected: State = true;
    expect(result).toEqual(expected);
  });
});
