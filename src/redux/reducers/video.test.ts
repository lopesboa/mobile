import {TOGGLE_FULLSCREEN} from '../actions/video/full-screen';
import type {Action as ToggleAction} from '../actions/video/full-screen';
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
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(TOGGLE_FULLSCREEN, () => {
    it('Default', () => {
      const action: ToggleAction = {
        type: TOGGLE_FULLSCREEN,
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
