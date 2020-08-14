import {Platform} from 'react-native';
import {Notifications, Notification} from '@coorpacademy/react-native-notifications';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import createServices from './services';
import createDataLayer from './layer/data';
import {ANALYTICS_EVENT_TYPE} from './const';

const dataLayer = createDataLayer();
const services = createServices(dataLayer);
const analytics = services.Analytics;

export default class NotificationHandler {
  constructor(onNotification) {
    Notifications.events().registerNotificationReceivedForeground(
      (notification: Notification, completion) => {
        completion({alert: true, sound: true, badge: true});
      },
    );

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      if (notification?.payload) {
        const userInfo = notification?.payload.userInfo;
        const content = JSON.parse(userInfo?.content ?? '{}');
        if (!content || (content && !content.universalRef)) {
          // do nothing
        } else {
          analytics?.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_OPENED, {
            type: 'finish-course',
          });
          onNotification(content);
        }
      }
      completion();
    });

    if (Platform.OS === 'android') {
      Notifications.getInitialNotification()
        .then((notification) => {
          if (notification?.payload) {
            const userInfo = notification?.payload.userInfo;
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification);
          }
          return;
        })
        .catch((err) => {
          // we should handle errors here
        });
    } else {
      PushNotificationIOS.getInitialNotification()
        .then((notification) => {
          if (notification) {
            const userInfo = notification?.getData().userInfo;
            return this.handleNotificationContent(userInfo?.content ?? '{}', onNotification);
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
  ) => {
    const parsedContent = JSON.parse(content);
    if (!parsedContent || (parsedContent && !parsedContent.universalRef)) {
      // do nothing
    } else {
      setTimeout(() => {
        analytics?.logEvent(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_OPENED, {
          type: 'finish-course',
        });
        onNotification(parsedContent);
      }, 0);
    }
    return;
  };
}
