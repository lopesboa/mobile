// @flow strict

import {PROGRESSION_START, PROGRESSION_NEXT} from '../actions/progression';
import type {Action} from '../actions/progression';

export type State = {|
  current?: number,
  count?: number
|};

const initialState: State = {
  current: undefined,
  count: undefined
};

const reducer = (state: State = initialState, {type, payload}: Action): State => {
  switch (type) {
    case PROGRESSION_START: {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        current: payload.current,
        count: payload.count
      };
    }
    case PROGRESSION_NEXT: {
      return {
        ...state,
        current: state.current + 1
      };
    }
    default:
      return state;
  }
};

export default reducer;
