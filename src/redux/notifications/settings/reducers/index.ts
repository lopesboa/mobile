import {createReducer} from '@reduxjs/toolkit';
import {Platform} from 'react-native';
import {NotificationSettingStatus, NotificationSettingType} from '../../../../types';

import translations from '../../../../translations';
import {NOTIFICATION_SETTINGS_STATUS, NOTIFICATION_SETTINGS_TYPE} from '../../../../const';
import {TOGGLE, Action} from '../actions';

export type State = Record<
  NotificationSettingType,
  {
    label: string;
    status: NotificationSettingStatus;
  }
>;

const getDefaultStatusForSetting = () =>
  Platform.OS === 'android'
    ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
    : NOTIFICATION_SETTINGS_STATUS.IDLE;

export const initialState: State = {
  authorizeAll: {
    label: translations.authorizeNotifications,
    status: getDefaultStatusForSetting(),
  },
  'finish-course': {
    label: translations.currentlyDoingReminder,
    status: getDefaultStatusForSetting(),
  },
  suggestion: {
    label: translations.suggestion,
    status: getDefaultStatusForSetting(),
  },
};

const hasAllNotificationsSettingsOff = (settings: State): boolean => {
  return Object.entries(settings)
    .filter(([key]) => key !== NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL)
    .every((setting) => setting[1].status === NOTIFICATION_SETTINGS_STATUS.DEACTIVATED);
};

const settingsReducer = createReducer(initialState, {
  [TOGGLE.type]: (state, action: Action) => {
    const {type: settingType, value: settingStatus} = action.payload;
    if (settingType === NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL) {
      return Object.entries(state).reduce((acc, [key, value]) => {
        return Object.assign(acc, {
          [key]: {
            ...value,
            status:
              settingStatus !== NOTIFICATION_SETTINGS_STATUS.ACTIVATED
                ? NOTIFICATION_SETTINGS_STATUS.DEACTIVATED
                : NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          },
        });
      }, {} as State);
    }

    const currentSettingAll = state[NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL];
    if (
      settingStatus === NOTIFICATION_SETTINGS_STATUS.ACTIVATED &&
      currentSettingAll.status !== NOTIFICATION_SETTINGS_STATUS.ACTIVATED
    ) {
      state[settingType].status = settingStatus;
      state[NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL].status =
        NOTIFICATION_SETTINGS_STATUS.ACTIVATED;
      return state;
    }
    state[action.payload.type].status = action.payload.value;

    if (hasAllNotificationsSettingsOff(state)) {
      state[NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL].status =
        NOTIFICATION_SETTINGS_STATUS.DEACTIVATED;
      return state;
    }

    return state;
  },
});

export default settingsReducer;
