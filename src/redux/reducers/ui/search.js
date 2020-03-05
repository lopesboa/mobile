// @flow strict

import {TOGGLE, EDIT, FETCH} from '../../actions/ui/search';
import type {Action} from '../../actions/ui/search';

export type State = {|
  isVisible: boolean,
  isFetching: boolean,
  value?: string
|};

export const initialState: State = {
  isVisible: false,
  isFetching: false
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE: {
      return {
        ...state,
        isVisible: action.payload
      };
    }
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
