import type {Brand} from '../../../types';
import type {Action} from '../../actions/brands';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import {FETCH_SUCCESS} from '../../actions/brands';
import {SIGN_OUT} from '../../actions/authentication';

export type State = Brand | null;

export const initialState: State = null;

const reducer = (state: State = initialState, action: Action | AuthenticationAction): State => {
  switch (action.type) {
    case SIGN_OUT: {
      return initialState;
    }
    case FETCH_SUCCESS: {
      return action.payload.item;
    }
    default:
      return state;
  }
};

export default reducer;
