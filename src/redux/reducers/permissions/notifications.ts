import type {Action} from '../../actions/permissions/notifications';
import {CHANGE} from '../../actions/permissions/notifications';
import type {PermissionStatus} from '../../../types';
import {PERMISSION_STATUS} from '../../../const';

export type State = PermissionStatus;

export const initialState: State = PERMISSION_STATUS.UNDETERMINED;

const reducer = (state: State = PERMISSION_STATUS.UNDETERMINED, action: Action): State => {
  switch (action.type) {
    case CHANGE: {
      const {status} = action.payload;
      return status;
    }
    default:
      return state;
  }
};

export default reducer;
