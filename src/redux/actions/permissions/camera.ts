import {Platform} from 'react-native';
import {ANALYTICS_EVENT_TYPE, PERMISSION_STATUS, PERMISSION_TYPE} from '../../../const';
import type {PermissionStatus} from '../../../types';
import translations from '../../../translations';
import type {Options} from '../../_types';

export const REQUEST = '@@permissions/camera/REQUEST';
export const CHECK = '@@permissions/camera/CHECK';
export const CHANGE = '@@permissions/camera/CHANGE';

export type PermissionType = 'camera';

export const toOSCameraPermission = () => {
  return Platform.OS === 'ios' ? `ios.permission.CAMERA` : `android.permission.CAMERA`;
};

export type RequestPayload = {
  type: PermissionType;
};

export type CheckPayload = {
  type: PermissionType;
};

export type ChangePayload = {
  type: PermissionType;
  status: PermissionStatus;
};

export type Action =
  | {
      type: typeof REQUEST;
      payload: RequestPayload;
    }
  | {
      type: typeof CHECK;
      payload: CheckPayload;
    }
  | {
      type: typeof CHANGE;
      payload: ChangePayload;
    };

export const change = (status: PermissionStatus): Action => ({
  type: CHANGE,
  payload: {
    type: PERMISSION_TYPE.CAMERA,
    status,
  },
});

const _requestPermission = (onDeny?: () => void) => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<PermissionStatus> => {
  const status = await services.Permissions.request(toOSCameraPermission());
  const currentPermissionStatus = getState().permissions.camera;

  if (status === PERMISSION_STATUS.DENIED && onDeny) {
    onDeny();
  }
  if (currentPermissionStatus !== status) {
    dispatch(change(status));
  }

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.PERMISSION, {
    status,
    type: PERMISSION_TYPE.CAMERA,
  });

  return status;
};

export const request = (description: string, onDeny?: () => void) => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<Action> => {
  const action = dispatch({
    type: REQUEST,
    payload: {
      type: PERMISSION_TYPE.CAMERA,
    },
  });

  const permissionStatus = getState().permissions[PERMISSION_TYPE.CAMERA];
  const systemStatus = await services.Permissions.check(toOSCameraPermission());
  const refusedPermissions = [
    PERMISSION_STATUS.DENIED,
    PERMISSION_STATUS.BLOCKED,
    PERMISSION_STATUS.UNDETERMINED,
  ];

  if (refusedPermissions.includes(permissionStatus) && systemStatus !== PERMISSION_STATUS.GRANTED) {
    services.Permissions.alert(
      translations.permission,
      description,
      [
        {
          text: translations.quit,
          onPress: () => {
            services.Permissions.alert(
              translations.permission,
              description,
              [
                {text: translations.quit, onPress: onDeny, style: 'cancel'},
                {
                  text: translations.openSettings,
                  onPress: () => services.Permissions.openSettings().catch(onDeny),
                },
              ],
              {cancelable: false},
            );
          },
          style: 'cancel',
        },
        {
          text: translations.ok,
          onPress: () => _requestPermission(onDeny)(dispatch, getState, {services}),
        },
      ],
      {cancelable: false},
    );
  } else {
    await _requestPermission(onDeny)(dispatch, getState, {services});
  }
  return action;
};

export const check = () => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<Action> => {
  const action = dispatch({
    type: CHECK,
    payload: {
      type: PERMISSION_TYPE.CAMERA,
    },
  });

  const status = await services.Permissions.check(toOSCameraPermission());
  const {permissions} = getState();

  if (permissions.camera !== status) {
    dispatch(change(status));
  }

  return action;
};
