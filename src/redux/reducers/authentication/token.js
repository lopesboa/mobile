// @flow strict

import type {Action} from '../../actions/brands';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import {SIGN_OUT, SIGN_IN_SUCCESS} from '../../actions/authentication';

export type State = {|
  token: string | null
|} | null;

export const initialState: State = {token: null};

const reducer = (state: State = initialState, action: Action | AuthenticationAction): State => {
  switch (action.type) {
    case SIGN_IN_SUCCESS: {
      return {
        token: action.payload.token
      };
    }
    case SIGN_OUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
