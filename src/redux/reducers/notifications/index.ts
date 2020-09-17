import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action as SettingsNotificationAction} from '../../actions/notifications/settings';
import type {State as SettingsNotificationState} from './settings';
import settingsNotificationReducer from './settings';
import scheduledNotificationReducer from './scheduled-notifications';
import type {State as ScheduledNotificationState} from './scheduled-notifications';

export type State = {
  settings: SettingsNotificationState;
  scheduledNotifications: ScheduledNotificationState;
};

const reducers: Reducer<State, SettingsNotificationAction> = combineReducers({
  settings: settingsNotificationReducer,
  scheduledNotifications: scheduledNotificationReducer,
});
export default reducers;
