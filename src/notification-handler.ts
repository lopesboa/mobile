import {Platform} from 'react-native';
import {Notifications, Notification} from '@coorpacademy/react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import createServices from './services';
import createDataLayer from './layer/data';
import {ANALYTICS_EVENT_TYPE} from './const';
import {NotificationType} from './types';
import {ChapterCard, DisciplineCard} from './layer/data/_types';

const dataLayer = createDataLayer();
const services = createServices(dataLayer);
const analytics = services.Analytics;

export default class NotificationHandler {
  constructor(onNotification: (content: DisciplineCard | ChapterCard) => void) {
    if (Platform.OS === 'android') {
      Notifications.events().registerNotificationReceivedForeground(
        (notification: Notification, completion) => {
          completion({alert: true, sound: true, badge: true});
        },
      );

      Notifications.events().registerNotificationOpened(
        (notification: Notification, completion) => {
          if (notification?.payload) {
            const userInfo = notification?.payload.userInfo;
            return this.handleNotificationContent(
              userInfo?.notificationType ?? '',
              userInfo?.content ?? '{}',
              onNotification,
            );
          }
          completion();
        },
      );

      Notifications.getInitialNotification()
        .then((notification) => {
          if (notification?.payload) {
            const userInfo = notification?.payload.userInfo;
            return this.handleNotificationContent(
              userInfo?.notificationType ?? '',
              userInfo?.content ?? '{}',
              onNotification,
              true,
            );
          }
          return;
        })
        .catch((err) => {
          // we should handle errors here
        });
    } else {
      PushNotification.configure({
        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: (notification) => {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
          if (notification) {
            const userInfo = notification.data.userInfo;
            return this.handleNotificationContent(
              userInfo?.notificationType ?? '',
              userInfo?.content ?? '{}',
              onNotification,
              false,
            );
          }
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: false,
        requestPermissions: false,
      });

      PushNotificationIOS.getInitialNotification()
        .then((notification) => {
          if (notification) {
            const userInfo = notification?.getData().userInfo;
            return this.handleNotificationContent(
              userInfo?.notificationType ?? '',
              userInfo?.content ?? '{}',
              onNotification,
              true,
            );
          }
          return;
        })
        .catch((err) => {
          // we should handle errors here
        });
    }
  }

  handleNotificationContent = (
    type: NotificationType,
    content: string,
    onNotification: (parseContent: DisciplineCard | ChapterCard) => void,
    defer = false,
  ): void => {
    const parsedContent: undefined | DisciplineCard | ChapterCard = JSON.parse(content);
    if (!parsedContent || (parsedContent && !parsedContent.universalRef)) return;
    analytics?.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_OPENED, {
      type,
    });
    if (defer) {
      setTimeout(() => {
        onNotification(parsedContent);
      }, 0);
    } else {
      onNotification(parsedContent);
    }
  };
}
