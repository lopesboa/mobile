import {TOGGLE_FULLSCREEN} from '../actions/video/full-screen';
import type {Action as ToggleAction} from '../actions/video/full-screen';

export type State = {
  isFullScreen: boolean
};

const initialState: State = {
  isFullScreen: false
};

const reducer = (state: State = initialState, action: ToggleAction): State => {
  switch (action.type) {
    case TOGGLE_FULLSCREEN: {
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
