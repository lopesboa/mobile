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

// const hasNotificationBeenScheduled = (
//   scheduledNotifications: ScheduledNotificationPayload[],
//   contentId: string,
// ): boolean => {
//   return scheduledNotifications?.some((notification) => notification.id === contentId);
// };

const scheduleNotification = (contentId: string, type: NotificationType, index: number) => (
  dispatch,
  getState,
  services: Services,
): StoreAction<Action | void> => {
  const {scheduledNotifications} = getState().notifications;
  // TODO: review this branch
  // if (hasNotificationBeenScheduled(scheduledNotifications[type], contentId)) return;
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

// we erease all the local notification schudled (lib/os + store)
// we loop on the sorted content array
// we set notifications taking the first element of the sorted content  array and the next one and so on
// first element : 48h later
// second element : 96h later
// third element : 144h later

// what if there is just one element should we set it three times? (48 / 96 / 144h later) > We set the same content 48 / 96 and 144h later.
// what if we have two content started (not finished)? > we set 1 / 2 / 1 again
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
  // delete all the registred notifications
  await unscheduleLocalNotifications(type)(dispatch, getState);

  // loop on sorted content array
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
