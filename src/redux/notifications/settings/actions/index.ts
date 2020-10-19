import {createAction} from '@reduxjs/toolkit';
import {NotificationSettingStatus, NotificationSettingType} from '../../../../types';
import {getNotificationsSettings} from '../../../utils/state-extract';

import {NOTIFICATION_SETTINGS_STATUS} from '../../../../const';

export type ActionPayload = {
  type: NotificationSettingType;
  value: NotificationSettingStatus;
};

export const ACTION_NAME = '@@notifications/SETTINGS_TOGGLE';
export const TOGGLE = createAction<ActionPayload, typeof ACTION_NAME>(ACTION_NAME);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

export const toggle = (type: NotificationSettingType, value?: NotificationSettingStatus) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const settings = getNotificationsSettings(state);
  const status =
    settings[type].status === NOTIFICATION_SETTINGS_STATUS.ACTIVATED
      ? NOTIFICATION_SETTINGS_STATUS.DEACTIVATED
      : NOTIFICATION_SETTINGS_STATUS.ACTIVATED;
  const action = TOGGLE({value: value ?? status, type});
  return dispatch(action);
};
