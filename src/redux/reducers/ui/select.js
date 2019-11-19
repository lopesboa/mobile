// @flow strict

import {FOCUS, BLUR} from '../../actions/ui/select';
import type {Action} from '../../actions/ui/select';

export type State = string | null;

export const initialState: State = null;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FOCUS: {
      return action.payload;
    }
    case BLUR: {
      return null;
    }
    default:
      return state;
  }
};

export default reducer;
