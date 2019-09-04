// @flow strict

import {TOGGLE} from '../actions/fast-slide';
import type {Action} from '../actions/fast-slide';

export type State = boolean;

const initialState: State = false;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default reducer;
