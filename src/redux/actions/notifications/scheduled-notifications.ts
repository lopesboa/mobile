import PushNotifications from 'react-native-push-notification';
import {StoreState} from '../../store';

// import {StoreAction} from '../../_types';
import {Services} from '../../../services';
import {/* ScheduledNotificationPayload*/ NotificationType} from '../../../types';
import {NOTIFICATION_TYPE} from '../../../const';

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

const scheduleNotificationOnDevice = (title: string, message: string, date: Date) => {
  PushNotifications.localNotificationSchedule({
    title: title, // (optional)
    message: message, // (required)});
    date: date,
    ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
  });
};

const scheduleFinishCourseNotification = (contentId: string, index: number) => {
  // 48h hours later * index + 1
  // const delay = new Date(Date.now() + 172800 * (index + 1) * 1000);
  const delay = new Date(Date.now() + 20 * (index + 1) * 1000);
  return scheduleNotificationOnDevice('title', 'message de dingue', delay);
};

const scheduleNotification = (contentId: string, type: NotificationType, index: number) => (
  dispatch,
): StoreAction<Action | void> => {
  const action = {
    type: SCHEDULE_NOTIFICATION,
    payload: {
      id: contentId,
      createdAt: new Date(),
      type,
    },
  };
  switch (type) {
    case NOTIFICATION_TYPE.FINISH_COURSE: {
      scheduleFinishCourseNotification(contentId, index);
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
  const {services} = options;
  const [
    firstContent,
    secondContent,
    thirdContent,
  ] = await services.NotificationContent.getAllContentByMostRecent();
  await unscheduleLocalNotifications(type)(dispatch, getState);

  if (firstContent && !secondContent && !thirdContent) {
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 0));
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 1));
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 2));
  } else if (firstContent && secondContent && !thirdContent) {
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 0));
    await dispatch(scheduleNotification(secondContent?.universalRef, type, 1));
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 2));
  } else if (firstContent && secondContent && thirdContent) {
    await dispatch(scheduleNotification(firstContent?.universalRef, type, 0));
    await dispatch(scheduleNotification(secondContent?.universalRef, type, 1));
    await dispatch(scheduleNotification(thirdContent?.universalRef, type, 2));
  } else {
    return;
  }
};
