import {Notifications} from '@coorpacademy/react-native-notifications';
import {StoreState} from '../../store';

// import {StoreAction} from '../../_types';
import {Services} from '../../../services';
import {/* ScheduledNotificationPayload*/ NotificationType} from '../../../types';
import {ANALYTICS_EVENT_TYPE, NOTIFICATION_TYPE} from '../../../const';
import translations from '../../../translations';
import {getUser, isFinishCourseNotificationActive} from '../../utils/state-extract';
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

const getNotificationWording = () => {
  const {finishCourseWordings} = translations;
  return finishCourseWordings[Math.floor(Math.random() * finishCourseWordings.length)];
};

const scheduleNotificationOnDevice = (
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  date: Date,
  id: number,
) => {
  const {title, description} = getNotificationWording();
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

const scheduleFinishCourseNotification = (
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  index: number,
  id: number,
) => {
  // 48h hours later * index + 1
  let currentDate: Date = new Date(Date.now());
  const delay = new Date(currentDate.setDate(currentDate.getDate() + 2 * (index + 1)));
  return scheduleNotificationOnDevice(userName, content, delay, id);
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
      scheduleFinishCourseNotification(userName, content, index, id);
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

  switch (type) {
    case NOTIFICATION_TYPE.FINISH_COURSE: {
      const {scheduledNotifications} = getState().notifications;

      scheduledNotifications[type]?.forEach((notification) => {
        Notifications.cancelLocalNotification(notification.id);
      });
      services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS, {
        id: 'unschedule',
        type,
        value: 1,
      });
      break;
    }
  }
  return dispatch(action);
};

/**
 * - Local notifications are scheduled once the user quits the player/app
 * - We first unschedule the existing local notifications before scheduling new ones
 * - Only 3 notifications are sent to the user on a week, the first one is sent 48h hours
 * later, the second one 96 and the last one 144.
 * - If user has only started one content, schedule 3 notifications for given content
 * - If user has started two contents, schedule 3 notifications with the order: [1, 2, 1]
 * - If user has started three contents, schedule 3 notifications with the order: [1, 2, 3]
 */
export const scheduleNotifications = (type: NotificationType) => async (
  dispatch,
  getState,
  options: {services: Services},
) => {
  const state = getState();
  if (isFinishCourseNotificationActive(state)) {
    const {services} = options;
    const [
      firstContent,
      secondContent,
      thirdContent,
    ] = await services.NotificationContent.getAllContentByMostRecent();
    await unscheduleLocalNotifications(type)(dispatch, getState, options);

    const user = getUser(state);

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
    services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS, {
      id: 'schedule',
      type,
      value: 1,
    });
  } else {
    return;
  }
};
