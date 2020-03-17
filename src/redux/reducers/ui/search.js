// @flow strict

import {EDIT, FETCH} from '../../actions/ui/search';
import type {Action} from '../../actions/ui/search';

export type State = {|
  isFetching: boolean,
  value?: string
|};

export const initialState: State = {
  isFetching: false
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case EDIT: {
      return {
        ...state,
        value: action.payload
      };
    }
    case FETCH: {
      return {
        ...state,
        isFetching: action.payload
      };
    }
    default:
      return state;
  }
};

export default reducer;
