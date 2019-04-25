// @flow strict

import {TOGGLE_GOD_MODE} from '../actions/godmode';
import type {Action} from '../actions/godmode';

export type State = boolean;

const initialState: State = false;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE_GOD_MODE: {
      return action.payload;
    }

    default:
      return state;
  }
};

export default reducer;
