import {getNotificationsSettings} from '../../utils/state-extract';
import {GetState} from '../../../types/coorpacademy/player-store/definitions/redux';
import {NotificationSettingStatus, NotificationType} from '../../../types';
import type { StoreAction } from '../../_types';
import {NOTIFICATION_SETTINGS_STATUS} from '../../../const';

export const TOGGLE = '@@notifications/SETTINGS_TOGGLE';

export type Action = {
  type: '@@notifications/SETTINGS_TOGGLE';
  payload: {
    type: 'finish-course' | 'suggestion';
    value: NotificationSettingStatus;
  };
};

export const toggle = (
  type: NotificationType,
  value?: NotificationSettingStatus,
): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const settings = getNotificationsSettings(state);
  const status =
    settings[type].status === NOTIFICATION_SETTINGS_STATUS.ACTIVATED
      ? NOTIFICATION_SETTINGS_STATUS.DEACTIVATED
      : NOTIFICATION_SETTINGS_STATUS.ACTIVATED;
  return dispatch({
    type: TOGGLE,
    payload: {
      value: value ?? status,
      type,
    },
  });
};
