import type {Action} from '../../actions/permissions/camera';
import {CHANGE} from '../../actions/permissions/camera';
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
