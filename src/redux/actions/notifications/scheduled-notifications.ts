import {Notifications} from '@coorpacademy/react-native-notifications';
import {StoreState} from '../../store';

// import {StoreAction} from '../../_types';
import {Services} from '../../../services';
import {/* ScheduledNotificationPayload*/ NotificationType} from '../../../types';
import {
  ANALYTICS_EVENT_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_SETTINGS_STATUS,
} from '../../../const';
import translations from '../../../translations';
import {getUser, getNotificationsSettings} from '../../utils/state-extract';
import {ChapterCard, DisciplineCard} from '../../../layer/data/_types';

export const SCHEDULE_NOTIFICATION = '@@notifications/SCHEDULE_NOTIFICATION';
export const UNSCHEDULE_NOTIFICATION = '@@notifications/UNSCHEDULE_NOTIFICATION';

export type Action =
  | {
      type: '@@notifications/SCHEDULE_NOTIFICATION';
      payload: {
        id: number;
        courseID: string;
        type: NotificationType;
        createdAt: Date;
      };
    }
  | {
      type: '@@notifications/UNSCHEDULE_NOTIFICATION';
      payload: {
        id: number;
        type: NotificationType;
      };
    };

const getNotificationWording = (type: NotificationType) => {
  const {finishCourseWordings, suggestionWordings} = translations;
  if (type === NOTIFICATION_TYPE.FINISH_COURSE) {
    return finishCourseWordings[Math.floor(Math.random() * finishCourseWordings.length)];
  }
  return suggestionWordings[Math.floor(Math.random() * suggestionWordings.length)];
};

const scheduleNotificationOnDevice = (
  type: NotificationType,
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  date: Date,
  id: number,
) => {
  const {title, description} = getNotificationWording(type);
  if (!userName || !content.title) return;
  const notification = {
    title: title.replace('{{givenName}}', userName),
    body: description.replace(/\\/g, '').replace('{{contentName}}', content.title),
    silent: false,
    userInfo: {id: content?.universalRef, content: JSON.stringify(content)},
    fireDate: +date,
  };
  Notifications.postLocalNotification(notification, id);
};

const _scheduleNotification = (
  type: NotificationType,
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  index: number,
  id: number,
  daysGap: number,
) => {
  // const NOTIFICATION_DAYS = daysGap * (index + 1);
  // let currentDate: Date = new Date(Date.now());
  // const delay = new Date(currentDate.setDate(currentDate.getDate() + NOTIFICATION_DAYS));
  const delay = new Date(Date.now() + 20 * (index + 1) * 1000);
  return scheduleNotificationOnDevice(type, userName, content, delay, id);
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
      _scheduleNotification(type, userName, content, index, id, 2);
      break;
    }
    case NOTIFICATION_TYPE.SUGGESTION: {
      _scheduleNotification(type, userName, content, index, id, 7);
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
        const content = await services.NotificationContent.getRecommendationContent();
        await unscheduleLocalNotifications(type)(dispatch, getState, options);
        if (content) {
          const user = getUser(state);
          // [7, 14, 21, 28, 42, 56, 84] days later
          await dispatch(scheduleNotification(user?.givenName, content, type, 0));
          await dispatch(scheduleNotification(user?.givenName, content, type, 1));
          await dispatch(scheduleNotification(user?.givenName, content, type, 2));
          await dispatch(scheduleNotification(user?.givenName, content, type, 3));
          await dispatch(scheduleNotification(user?.givenName, content, type, 5));
          await dispatch(scheduleNotification(user?.givenName, content, type, 7));
          await dispatch(scheduleNotification(user?.givenName, content, type, 11));
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
