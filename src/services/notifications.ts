import PushNotification from 'react-native-push-notification';

export type NotificationService = {
  configure: typeof PushNotification.configure;
  localNotification: typeof PushNotification.localNotification;
  localNotificationSchedule: typeof PushNotification.localNotificationSchedule;
  cancelLocalNotifications: typeof PushNotification.cancelLocalNotifications;
  cancelAllLocalNotifications: typeof PushNotification.cancelAllLocalNotifications;
};

const services: NotificationService = {
  configure: PushNotification.configure,
  localNotification: PushNotification.localNotification,
  localNotificationSchedule: PushNotification.localNotificationSchedule,
  cancelLocalNotifications: PushNotification.cancelLocalNotifications,
  cancelAllLocalNotifications: PushNotification.cancelAllLocalNotifications,
};
export default services;
