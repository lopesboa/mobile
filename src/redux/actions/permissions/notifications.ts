import {Platform} from 'react-native';
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
  const {status} = await services.Permissions.requestNotifications(['alert', 'badge', 'sound']);
  const currentPermissionStatus = getState().permissions.notifications;

  if (status === PERMISSION_STATUS.DENIED && onDeny) {
    onDeny();
  }
  if (currentPermissionStatus !== status) {
    dispatch(change(status));
  }

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.PERMISSION, {
    status,
    type: PERMISSION_TYPE.NOTIFICATIONS,
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
      type: PERMISSION_TYPE.NOTIFICATIONS,
    },
  });

  await _requestPermission(onDeny)(dispatch, getState, {services});
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
      type: PERMISSION_TYPE.NOTIFICATIONS,
    },
  });

  const {status} = await services.Permissions.checkNotifications();
  const {permissions} = getState();

  if (permissions.notifications !== status) {
    dispatch(change(status));
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

  const {status} = await services.Permissions.checkNotifications();
  const {permissions} = getState();

  if (
    permissions.notifications === PERMISSION_STATUS.GRANTED &&
    status === PERMISSION_STATUS.GRANTED
  ) {
    dispatch(change(PERMISSION_STATUS.DENIED));
  } else {
    dispatch(change(PERMISSION_STATUS.GRANTED));
  }
};
