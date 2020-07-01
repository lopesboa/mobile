import {TOGGLE_FULLSCREEN, toggleFullscreen} from './full-screen';
import type {Action} from './full-screen';

describe('Video', () => {
  it('toggleFullscreen', () => {
    const result = toggleFullscreen(true);
    const expected: Action = {
      type: TOGGLE_FULLSCREEN,
      payload: true,
    };
    expect(result).toEqual(expected);
  });
});
