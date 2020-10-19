import {createAction} from '@reduxjs/toolkit';
import {Notifications} from '@coorpacademy/react-native-notifications';
import {StoreAction} from '../../../_types';
import {NotificationType} from '../../../../types';
import {StoreState} from '../../../store';

import {Services} from '../../../../services';

import {
  ANALYTICS_EVENT_TYPE,
  NOTIFICATION_SETTINGS_STATUS,
  NOTIFICATION_TYPE,
} from '../../../../const';
import {getUser, getNotificationsSettings} from '../../../utils/state-extract';
import {ChapterCard, DisciplineCard} from '../../../../layer/data/_types';
import {scheduleNotificationOnDevice, calculateNotificationDeliveryDate} from '../utils';

export type ScheduleActionPayload = {
  id: number;
  courseID: string;
  type: NotificationType;
  createdAt: Date;
};

export type UnscheduleActionPayload = {
  id: number;
  type: NotificationType;
};

export const SCHEDULE_NOTIFICATION_ACTION_NAME = '@@notifications/SCHEDULE_NOTIFICATION';
export const UNSCHEDULE_NOTIFICATION_ACTION_NAME = '@@notifications/UNSCHEDULE_NOTIFICATION';

export const SCHEDULE_NOTIFICATION = createAction<
  ScheduleActionPayload,
  typeof SCHEDULE_NOTIFICATION_ACTION_NAME
>(SCHEDULE_NOTIFICATION_ACTION_NAME);

export const UNSCHEDULE_NOTIFICATION = createAction<
  UnscheduleActionPayload,
  typeof UNSCHEDULE_NOTIFICATION_ACTION_NAME
>(UNSCHEDULE_NOTIFICATION_ACTION_NAME);

export type Action<T = typeof SCHEDULE_NOTIFICATION_ACTION_NAME, R = ScheduleActionPayload> = {
  type: T;
  payload: R;
};

const scheduleNotification = (
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  type: NotificationType,
  index: number,
) => (dispatch): StoreAction<Action | void> => {
  const id: number = Math.floor(Math.random() * Math.pow(2, 32));
  const action = {
    type: SCHEDULE_NOTIFICATION,
    payload: {
      id: id,
      courseID: content?.universalRef,
      createdAt: new Date(),
      type,
    },
  };
  switch (type) {
    case NOTIFICATION_TYPE.FINISH_COURSE: {
      const notificationDeliveryDate = calculateNotificationDeliveryDate(index, 2);
      scheduleNotificationOnDevice(type, userName, content, notificationDeliveryDate, id);
      break;
    }
    case NOTIFICATION_TYPE.SUGGESTION: {
      const notificationDeliveryDate = calculateNotificationDeliveryDate(index, 7);
      scheduleNotificationOnDevice(type, userName, content, notificationDeliveryDate, id);
      break;
    }
  }
  return dispatch(action);
};

export const unscheduleLocalNotifications = (type: NotificationType) => async (
  dispatch,
  getState: () => StoreState,
  {services}: {services: Services},
) => {
  const action = {
    type: UNSCHEDULE_NOTIFICATION,
    payload: {
      type: type,
    },
  };

  const {scheduledNotifications} = getState().notifications;

  scheduledNotifications[type]?.forEach((notification) => {
    Notifications.cancelLocalNotification(notification.id);
  });
  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS, {
    id: 'unschedule',
    type,
    value: 1,
  });

  return dispatch(action);
};

/**
 * - Local notifications are scheduled once the user quits the player/app
 * - We first unschedule the existing local notifications before scheduling new ones
 * -
 * - FINISH COURSE NOTIFICATIONS
 * - Only 3 notifications are sent to the user on a week, the first one is sent 2 days
 * later, the second one 4 days and the last one 6 days.
 * - If user has only started one content, schedule 3 notifications for given content
 * - If user has started two contents, schedule 3 notifications with the order: [1, 2, 1]
 * - If user has started three contents, schedule 3 notifications with the order: [1, 2, 3]
 * -
 * - SUGGESTION NOTIFICATIONS
 * - Seven notifications are sent to the user, they're spread in gaps of 7 days for the
 * - first four, then 14 days for the 5th and the 6th and the last one is sent 28 days after
 * - the first one
 */
export const scheduleNotifications = (type: NotificationType) => async (
  dispatch,
  getState,
  options: {services: Services},
) => {
  const state = getState();
  const settings = getNotificationsSettings(state);
  if (settings[type].status === NOTIFICATION_SETTINGS_STATUS.ACTIVATED) {
    const {services} = options;
    switch (type) {
      case NOTIFICATION_TYPE.FINISH_COURSE: {
        const [
          firstContent,
          secondContent,
          thirdContent,
        ] = await services.NotificationContent.getAllContentByMostRecent();
        await unscheduleLocalNotifications(type)(dispatch, getState, options);

        const user = getUser(state);

        // [2, 4, 6] days later
        if (firstContent && !secondContent && !thirdContent) {
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 0));
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 1));
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 2));
        } else if (firstContent && secondContent && !thirdContent) {
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 0));
          await dispatch(scheduleNotification(user?.givenName, secondContent, type, 1));
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 2));
        } else if (firstContent && secondContent && thirdContent) {
          await dispatch(scheduleNotification(user?.givenName, firstContent, type, 0));
          await dispatch(scheduleNotification(user?.givenName, secondContent, type, 1));
          await dispatch(scheduleNotification(user?.givenName, thirdContent, type, 2));
        } else {
          return;
        }
        break;
      }
      case NOTIFICATION_TYPE.SUGGESTION: {
        const contents = await services.NotificationContent.getRecommendationContent();
        await unscheduleLocalNotifications(type)(dispatch, getState, options);
        if (contents) {
          const user = getUser(state);
          // [7, 14, 21, 28, 42, 56, 84] days later
          await dispatch(scheduleNotification(user?.givenName, contents[0], type, 0));
          await dispatch(scheduleNotification(user?.givenName, contents[1], type, 1));
          await dispatch(scheduleNotification(user?.givenName, contents[2], type, 2));
          await dispatch(scheduleNotification(user?.givenName, contents[3], type, 3));
          await dispatch(scheduleNotification(user?.givenName, contents[4], type, 5));
          await dispatch(scheduleNotification(user?.givenName, contents[5], type, 7));
          await dispatch(scheduleNotification(user?.givenName, contents[6], type, 11));
        } else {
          return;
        }
        break;
      }
    }
    services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS, {
      id: 'schedule',
      type,
      value: 1,
    });
  } else {
    return;
  }
};
