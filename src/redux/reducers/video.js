// @flow strict

import {VIDEO_TOGGLE_FULLSCREEN} from '../actions/video';
import type {Action} from '../actions/video';

export type State = {|
  isFullScreen: boolean
|};

const initialState: State = {
  isFullScreen: false
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case VIDEO_TOGGLE_FULLSCREEN: {
      return {
        ...state,
        isFullScreen: action.payload
      };
    }
    default:
      return state;
  }
};

export default reducer;
