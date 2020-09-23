import {initialState as NotificationsSettingsInitialState} from './reducers/notifications/settings';
import {initialState as ScheduledNotificationsInitialState} from './reducers/notifications/scheduled-notifications';

interface Migration<T> {
  [key: number]: (state: T) => T;
}

const createMigration = <
  T extends {notifications: {settings: any; scheduledNotifications: any}}
>(): Migration<T> => {
  return {
    2: (state: T) => {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          scheduledNotifications: Object.assign(
            ScheduledNotificationsInitialState,
            state.notifications.scheduledNotifications,
          ),
          settings: Object.assign(NotificationsSettingsInitialState, state.notifications.settings),
        },
      };
    },
  };
};

export default createMigration;
