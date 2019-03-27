// @flow strict

import {VIDEO_TOGGLE_FULLSCREEN} from '../actions/video';
import type {Action} from '../actions/video';
import reducer from './video';
import type {State} from './video';

describe('Video', () => {
  const expectedInitialState: State = {
    isFullScreen: false
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(VIDEO_TOGGLE_FULLSCREEN, () => {
    it('Default', () => {
      const action: Action = {
        type: VIDEO_TOGGLE_FULLSCREEN,
        payload: false
      };
      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        isFullScreen: false
      };
      expect(result).toEqual(expected);
    });
  });
});
