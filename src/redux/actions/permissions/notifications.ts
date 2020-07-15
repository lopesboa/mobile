import {toggle as toggleFinishCourseNotification} from '../notifications/finish-course';
import {ANALYTICS_EVENT_TYPE, PERMISSION_STATUS, PERMISSION_TYPE} from '../../../const';
import type {PermissionStatus} from '../../../types';
import translations from '../../../translations';
import type {Options} from '../../_types';

export const REQUEST = '@@permissions/notifications/REQUEST';
export const CHECK = '@@permissions/notifications/CHECK';
export const CHANGE = '@@permissions/notifications/CHANGE';

export type PermissionType = 'notifications';

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
    type: PERMISSION_TYPE.NOTIFICATIONS,
    status,
  },
});

const _requestPermission = (onDeny?: () => void) => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<PermissionStatus> => {
  const {status: systemStatus} = await services.Permissions.requestNotifications([
    'alert',
    'badge',
    'sound',
  ]);
  const currentPermissionStatus = getState().permissions.notifications;

  if (
    (systemStatus === PERMISSION_STATUS.DENIED || systemStatus === PERMISSION_STATUS.BLOCKED) &&
    onDeny
  ) {
    onDeny();
  }
  if (currentPermissionStatus !== systemStatus) {
    dispatch(change(systemStatus));

    dispatch(
      toggleFinishCourseNotification(
        ![PERMISSION_STATUS.DENIED, PERMISSION_STATUS.BLOCKED].includes(systemStatus),
      ),
    );
  }

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.PERMISSION, {
    status: systemStatus,
    type: PERMISSION_TYPE.NOTIFICATIONS,
  });

  return systemStatus;
};

export const request = (description: string, onDeny?: () => void) => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<PermissionStatus> => {
  dispatch({
    type: REQUEST,
    payload: {
      type: PERMISSION_TYPE.NOTIFICATIONS,
    },
  });

  const permissionStatus = getState().permissions[PERMISSION_TYPE.NOTIFICATIONS];
  const {status: systemStatus} = await services.Permissions.checkNotifications();

  if (
    (permissionStatus === PERMISSION_STATUS.DENIED && systemStatus === PERMISSION_STATUS.DENIED) ||
    (permissionStatus === PERMISSION_STATUS.BLOCKED && systemStatus === PERMISSION_STATUS.BLOCKED)
  ) {
    await _requestPermission(() => {
      services.Permissions.alert(
        translations.permission,
        description,
        [
          {
            text: translations.quit,
            onPress: onDeny,
            style: 'cancel',
          },
          {
            text: translations.openSettings,
            onPress: () => services.Permissions.openSettings().catch(onDeny),
          },
        ],
        {cancelable: false},
      );
    })(dispatch, getState, {services});
  } else {
    await _requestPermission(onDeny)(dispatch, getState, {services});
  }
  return getState().permissions[PERMISSION_TYPE.NOTIFICATIONS];
};

export const check = () => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<Action> => {
  const action = dispatch({
    type: CHECK,
    payload: {
      type: PERMISSION_TYPE.NOTIFICATIONS,
    },
  });

  const {status: systemStatus} = await services.Permissions.checkNotifications();
  const permissionStatus = getState().permissions[PERMISSION_TYPE.NOTIFICATIONS];

  if (permissionStatus !== PERMISSION_STATUS.MAYBE_LATER && permissionStatus !== systemStatus) {
    dispatch(change(systemStatus));
    if (PERMISSION_STATUS.GRANTED === systemStatus) {
      dispatch(toggleFinishCourseNotification(true));
    } else if ([PERMISSION_STATUS.DENIED, PERMISSION_STATUS.BLOCKED].includes(permissionStatus)) {
      dispatch(toggleFinishCourseNotification(false));
    }
  }

  return action;
};

export const toggle = () => async (
  dispatch: Dispatch,
  getState: GetState,
  {services}: Options,
): Promise<void> => {
  dispatch({
    type: CHECK,
    payload: {
      type: PERMISSION_TYPE.NOTIFICATIONS,
    },
  });

  const {status: systemStatus} = await services.Permissions.checkNotifications();
  const permissionStatus = getState().permissions[PERMISSION_TYPE.NOTIFICATIONS];

  if (
    permissionStatus === PERMISSION_STATUS.GRANTED &&
    systemStatus === PERMISSION_STATUS.GRANTED
  ) {
    dispatch(change(PERMISSION_STATUS.DENIED));
  } else {
    dispatch(change(PERMISSION_STATUS.GRANTED));
  }
};
