import PushNotifications from 'react-native-push-notification';
import {StoreState} from '../../store';

// import {StoreAction} from '../../_types';
import {Services} from '../../../services';
import {/* ScheduledNotificationPayload*/ NotificationType} from '../../../types';
import {NOTIFICATION_TYPE} from '../../../const';
import translations from '../../../translations';
import {getUser, isFinishCourseNotificationActive} from '../../utils/state-extract';
import {ChapterCard, DisciplineCard} from '../../../layer/data/_types';

export const SCHEDULE_NOTIFICATION = '@@notifications/SCHEDULE_NOTIFICATION';
export const UNSCHEDULE_NOTIFICATION = '@@notifications/UNSCHEDULE_NOTIFICATION';

export type Action =
  | {
      type: '@@notifications/SCHEDULE_NOTIFICATION';
      payload: {
        id: string;
        type: NotificationType;
        createdAt: Date;
      };
    }
  | {
      type: '@@notifications/UNSCHEDULE_NOTIFICATION';
      payload: {
        id: string;
        type: NotificationType | 'all';
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
) => {
  const {title, description} = getNotificationWording();
  if (!userName || !content.title) return;
  PushNotifications.localNotificationSchedule({
    id: content?.universalRef,
    title: title.replace('{{givenName}}', userName),
    message: description.replace('{{contentName}}', content.title),
    date: date,
    ignoreInForeground: true,
    userInfo: {id: content?.universalRef, content: JSON.stringify(content)},
  });
};

const scheduleFinishCourseNotification = (
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  index: number,
) => {
  // 48h hours later * index + 1
  // const delay = new Date(Date.now() + 172800 * (index + 1) * 1000);
  const delay = new Date(Date.now() + 20 * (index + 1) * 1000);
  return scheduleNotificationOnDevice(userName, content, delay);
};

const scheduleNotification = (
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  type: NotificationType,
  index: number,
) => (dispatch): StoreAction<Action | void> => {
  const action = {
    type: SCHEDULE_NOTIFICATION,
    payload: {
      id: content?.universalRef,
      createdAt: new Date(),
      type,
    },
  };
  switch (type) {
    case NOTIFICATION_TYPE.FINISH_COURSE: {
      scheduleFinishCourseNotification(userName, content, index);
    }
  }
  return dispatch(action);
};

export const unscheduleLocalNotifications = (type?: NotificationType) => async (
  dispatch,
  getState: () => StoreState,
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
        PushNotifications.cancelLocalNotifications({id: notification.id});
      });
      break;
    }
    default: {
      PushNotifications.cancelAllLocalNotifications();
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
    await unscheduleLocalNotifications(type)(dispatch, getState);

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
  } else {
    return;
  }
};
