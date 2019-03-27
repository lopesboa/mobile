// @flow strict

import {VIDEO_TOGGLE_FULLSCREEN, toggleFullscreen} from './video';
import type {Action} from './video';

describe('Video', () => {
  it('toggleFullscreen', () => {
    const result = toggleFullscreen(true);
    const expected: Action = {
      type: VIDEO_TOGGLE_FULLSCREEN,
      payload: true
    };
    expect(result).toEqual(expected);
  });
});
