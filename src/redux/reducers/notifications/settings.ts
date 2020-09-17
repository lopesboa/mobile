import {Platform} from 'react-native';
import {NotificationSettingStatus, NotificationType} from '../../../types';
import {TOGGLE} from '../../actions/notifications/settings';
import type {Action} from '../../actions/notifications/settings';
import translations from '../../../translations';
import { NOTIFICATION_SETTINGS_STATUS } from '../../../const';

export type State = Record<
  NotificationType,
  {
    label: string;
    status: NotificationSettingStatus;
  }
>;

const initialState: State = {
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

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE: {
      const oldSetting = state[action.payload.type];
      const newSetting = {
        [action.payload.type]: {
          ...oldSetting,
          status: action.payload.value,
        },
      };
      const newState = {
        ...state,
        ...newSetting,
      };
      return {
        ...state,
        ...newState,
      };
    }
    default:
      return state;
  }
};

export default reducer;
