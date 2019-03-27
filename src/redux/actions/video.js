// @flow strict

export const VIDEO_TOGGLE_FULLSCREEN = '@@video/TOGGLE_FULLSCREEN';

export type Action = {|type: '@@video/TOGGLE_FULLSCREEN', payload: boolean|};

export const toggleFullscreen = (payload: boolean): Action => ({
  type: VIDEO_TOGGLE_FULLSCREEN,
  payload
});
