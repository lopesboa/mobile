// @flow strict

import {TOGGLE_FAST_SLIDE} from '../actions/fastslide';
import type {Action} from '../actions/fastslide';

export type State = boolean;

const initialState: State = false;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE_FAST_SLIDE: {
      return action.payload;
    }

    default:
      return state;
  }
};

export default reducer;
