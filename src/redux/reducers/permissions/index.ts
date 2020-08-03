import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action as CameraPermissionAction} from '../../actions/permissions/camera';
import type {Action as NotificationsPermissionAction} from '../../actions/permissions/notifications';
import cameraPermissionReducer from './camera';
import notificationsPermissionReducer from './notifications';
import type {State as CameraPermissionState} from './camera';
import type {State as NotificationsPermissionState} from './notifications';

export type State = {
  camera: CameraPermissionState;
  notifications: NotificationsPermissionState;
};

const reducers: Reducer<
  State,
  CameraPermissionAction | NotificationsPermissionAction
> = combineReducers({
  camera: cameraPermissionReducer,
  notifications: notificationsPermissionReducer,
});
export default reducers;
