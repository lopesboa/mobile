import PushNotifications from 'react-native-push-notification';

// import {StoreAction} from '../../_types';
import {Services} from '../../../services';
import {ScheduledNotificationPayload, NotificationType} from '../../../types';

export const SCHEDULE_NOTIFICATION = '@@notifications/SCHEDULE_NOTIFICATION';
export const UNSCHEDULE_NOTIFICATION = '@@notifications/UNSCHEDULE_NOTIFICATION';
export const UNSCHEDULE_ALL_NOTIFICATION = '@@notifications/UNSCHEDULE_ALL_NOTIFICATION';

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
        type: NotificationType;
      };
    }
  | {
      type: '@@notifications/UNSCHEDULE_ALL_NOTIFICATION';
      payload: {
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

const hasNotificationBeenScheduled = (
  scheduledNotifications: ScheduledNotificationPayload[],
  contentId: string,
): boolean => {
  return scheduledNotifications.some((notification) => notification.id === contentId);
};

export const scheduleNotification = (contentId: string, type: NotificationType, index: number) => (
  dispatch,
  getState,
  services: Services,
): StoreAction<Action | void> => {
  const {scheduledNotifications} = getState().notifications;
  if (hasNotificationBeenScheduled(scheduledNotifications[type], contentId)) return;
  const action = {
    type: SCHEDULE_NOTIFICATION,
    payload: {
      id: contentId,
      createdAt: new Date(),
      type,
    },
  };
  switch (type) {
    case 'finish-course': {
      scheduleFinishCourseNotification(contentId, index);
    }
  }
  return dispatch(action);
};

export const unscheduleAllLocalNotifications = (type?: NotificationType) => async (
  dispatch,
  getState,
  services: Services,
) => {
  let action;
  if (!type) {
    action = {
      type: UNSCHEDULE_ALL_NOTIFICATION,
      payload: {
        type: 'all',
      },
    };

    PushNotifications.cancelAllLocalNotifications();
    return;
  }

  const {scheduledNotifications} = getState().notifications;

  scheduledNotifications[type].forEach((notification) => {
    PushNotifications.cancelLocalNotifications({id: notification.id});
  });

  action = {
    type: UNSCHEDULE_ALL_NOTIFICATION,
    payload: {
      type,
    },
  };

  dispatch(action);
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
  options: Services,
) => {
  const {services} = options;
  const contentByMostRecent = await services.NotificationContent.getAllContentByMostRecent();
  // delete all the registred notifications
  unscheduleAllLocalNotifications(type)(dispatch, getState, services);

  // loop on sorted content array
  if (contentByMostRecent.length === 1) {
    const content = contentByMostRecent[0];
    if (!content) return;
    scheduleNotification(content?.universalRef, type, 0);
    scheduleNotification(content?.universalRef, type, 1);
    scheduleNotification(content?.universalRef, type, 2);
    return;
  }
  if (contentByMostRecent.length <= 2) {
    const [firstContent, secondContent] = contentByMostRecent;
    if (!firstContent || !secondContent) return;
    scheduleNotification(firstContent?.universalRef, type, 0);
    scheduleNotification(secondContent?.universalRef, type, 1);
    scheduleNotification(firstContent?.universalRef, type, 2);
    return;
  }
  contentByMostRecent.forEach((content, index) => {
    if (!content || index > 2) return;
    // set notification
    dispatch(scheduleNotification(content?.universalRef, type, index));
  });
  return;
};
