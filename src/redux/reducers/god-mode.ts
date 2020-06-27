import {TOGGLE} from '../actions/god-mode';
import type {Action} from '../actions/god-mode';

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
