import type {Action} from '../../actions/brands';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import {SIGN_OUT, SIGN_IN_SUCCESS} from '../../actions/authentication';

export type State = string | null;

export const initialState: State = null;

const reducer = (state: State = initialState, action: Action | AuthenticationAction): State => {
  switch (action.type) {
    case SIGN_IN_SUCCESS: {
      return action.payload;
    }
    case SIGN_OUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
