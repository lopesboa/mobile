import {Platform} from 'react-native';
import {Notifications, Notification} from '@coorpacademy/react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import createServices from './services';
import createDataLayer from './layer/data';
import {ANALYTICS_EVENT_TYPE} from './const';

const dataLayer = createDataLayer();
const services = createServices(dataLayer);
const analytics = services.Analytics;

export default class NotificationHandler {
  constructor(onNotification) {
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
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification);
          }
          completion();
        },
      );

      Notifications.getInitialNotification()
        .then((notification) => {
          if (notification?.payload) {
            const userInfo = notification?.payload.userInfo;
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification, true);
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
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification);
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
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification, true);
          }
          return;
        })
        .catch((err) => {
          // we should handle errors here
        });
    }
  }

  handleNotificationContent = (
    content: string,
    onNotification: (parseContent: unknown) => void,
    timeOut = false,
  ) => {
    const parsedContent = JSON.parse(content);
    if (!parsedContent || (parsedContent && !parsedContent.universalRef)) return;
    analytics?.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_OPENED, {
      type: 'finish-course',
    });
    if (timeOut) {
      setTimeout(() => {
        onNotification(parsedContent);
      }, 0);
    } else {
      onNotification(parsedContent);
    }
  };
}
