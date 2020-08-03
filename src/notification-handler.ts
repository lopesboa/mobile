import {Notifications, Notification} from '@coorpacademy/react-native-notifications';

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
          onNotification(content);
        }
      }
      completion();
    });

    Notifications.getInitialNotification()
      .then((notification) => {
        if (notification?.payload) {
          const userInfo = notification?.payload.userInfo;
          const content = JSON.parse(userInfo?.content ?? '{}');
          if (!content || (content && !content.universalRef)) {
            // do nothing
          } else {
            setTimeout(() => onNotification(content), 0);
          }
          return;
        }
        return;
      })
      .catch((err) => {
        // we should handle errors here
      });
  }
}
