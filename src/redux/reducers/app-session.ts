import {SAVE_INCREMENT} from '../actions/app-session';
import type {Action} from '../actions/app-session';
import {SIGN_OUT} from '../actions/authentication';
import type {Action as AuthenticationAction} from '../actions/authentication';

export type State = number;

const initialState: State = 0;

const reducer = (state: State = initialState, action: Action | AuthenticationAction): State => {
  switch (action.type) {
    case SIGN_OUT: {
      return initialState;
    }
    case SAVE_INCREMENT: {
      const newState = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
