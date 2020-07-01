import {INCREMENT} from '../actions/app-session';
import type {Action} from '../actions/app-session';

export type State = number;

const initialState: State = 0;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INCREMENT: {
      const newState = state + 1;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
