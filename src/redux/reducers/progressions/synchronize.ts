import type {AllAction as SynchronizeAction} from '../../actions/progressions/synchronize';
import {
  SYNCHRONIZE_ALL_REQUEST,
  SYNCHRONIZE_ALL_SUCCESS,
  SYNCHRONIZE_ALL_FAILURE,
} from '../../actions/progressions/synchronize';

export type State = {
  isSynchronizing: boolean;
};

export const initialState: State = {
  isSynchronizing: false,
};

const reducer = (state: State = initialState, action: SynchronizeAction): State => {
  switch (action.type) {
    case SYNCHRONIZE_ALL_REQUEST: {
      return {
        ...state,
        isSynchronizing: true,
      };
    }
    case SYNCHRONIZE_ALL_SUCCESS: {
      return {
        ...state,
        isSynchronizing: false,
      };
    }
    case SYNCHRONIZE_ALL_FAILURE: {
      return {
        ...state,
        isSynchronizing: false,
      };
    }
    default:
      return state;
  }
};

export default reducer;
