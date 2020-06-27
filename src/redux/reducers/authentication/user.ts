import type {User} from '../../../types';
import type {Action} from '../../actions/user';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import {FETCH_SUCCESS} from '../../actions/user';
import {SIGN_OUT} from '../../actions/authentication';

export type State = User | null;

export const initialState: State = null;

const reducer = (state: State = initialState, action: Action | AuthenticationAction): State => {
  switch (action.type) {
    case SIGN_OUT: {
      return initialState;
    }
    case FETCH_SUCCESS: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default reducer;
