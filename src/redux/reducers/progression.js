// @flow strict

import {
  PROGRESSION_START,
  PROGRESSION_NEXT,
  PROGRESSION_SET_LIVES,
  PROGRESSION_LOSE_LIFE
} from '../actions/progression';
import type {Action} from '../actions/progression';

export type State = {|
  current?: number,
  count?: number,
  lives?: number
|};

const initialState: State = {
  current: undefined,
  count: undefined,
  lives: undefined
};

const reducer = (state: State = initialState, {type, payload}: Action): State => {
  switch (type) {
    case PROGRESSION_START: {
      if (!payload || !payload.current || !payload.count) {
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
    case PROGRESSION_SET_LIVES: {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        lives: payload.lives || undefined
      };
    }
    case PROGRESSION_LOSE_LIFE: {
      if (!state.lives || state.lives <= 0) {
        return state;
      }
      return {
        ...state,
        lives: state.lives - 1
      };
    }
    default:
      return state;
  }
};

export default reducer;
