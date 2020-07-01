import type {Action} from '../actions/permissions';
import {CHANGE} from '../actions/permissions';
import type {PermissionStatus} from '../../types';

export type State = {
  camera?: PermissionStatus;
};

export const initialState: State = {
  camera: undefined,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CHANGE: {
      const {type, status} = action.payload;

      return {
        ...state,
        [type]: status,
      };
    }
    default:
      return state;
  }
};

export default reducer;
