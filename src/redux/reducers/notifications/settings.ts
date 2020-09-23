import {Platform} from 'react-native';
import {NotificationSettingStatus, NotificationSettingType} from '../../../types';
import {TOGGLE} from '../../actions/notifications/settings';
import type {Action} from '../../actions/notifications/settings';
import translations from '../../../translations';
import {NOTIFICATION_SETTINGS_STATUS, NOTIFICATION_SETTINGS_TYPE} from '../../../const';

export type State = Record<
  NotificationSettingType,
  {
    label: string;
    status: NotificationSettingStatus;
  }
>;

export const initialState: State = {
  authorizeAll: {
    label: translations.authorizeNotifications,
    status:
      Platform.OS === 'android'
        ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
        : NOTIFICATION_SETTINGS_STATUS.IDLE,
  },
  'finish-course': {
    label: translations.currentlyDoingReminder,
    status:
      Platform.OS === 'android'
        ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
        : NOTIFICATION_SETTINGS_STATUS.IDLE,
  },
  suggestion: {
    label: translations.suggestion,
    status:
      Platform.OS === 'android'
        ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
        : NOTIFICATION_SETTINGS_STATUS.IDLE,
  },
};

const hasAllNotificationsSettingsOff = (settings: State): boolean => {
  return Object.entries(settings)
    .filter(([key]) => key !== NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL)
    .every((setting) => setting[1].status === NOTIFICATION_SETTINGS_STATUS.DEACTIVATED);
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE: {
      const {type: settingType, value: settingStatus} = action.payload;
      const currentSetting = state[action.payload.type];
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
        return {
          ...state,
          [settingType]: {
            ...currentSetting,
            status: settingStatus,
          },
          [NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL]: {
            ...currentSettingAll,
            status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          },
        };
      }
      const newState = {
        ...state,
        [action.payload.type]: {
          ...currentSetting,
          status: action.payload.value,
        },
      };

      if (hasAllNotificationsSettingsOff(newState)) {
        return {
          ...newState,
          [NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL]: {
            ...currentSettingAll,
            status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          },
        };
      }
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
