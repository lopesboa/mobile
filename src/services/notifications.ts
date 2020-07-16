import PushNotifications from 'react-native-push-notification';

export type NotificationService = {
  configure: typeof PushNotifications.configure;
  localNotification: typeof PushNotifications.localNotification;
  localNotificationSchedule: typeof PushNotifications.localNotificationSchedule;
  cancelLocalNotifications: typeof PushNotifications.cancelLocalNotifications;
  cancelAllLocalNotifications: typeof PushNotifications.cancelAllLocalNotifications;
};

const services: NotificationService = {
  configure: PushNotifications.configure,
  localNotification: PushNotifications.localNotification,
  localNotificationSchedule: PushNotifications.localNotificationSchedule,
  cancelLocalNotifications: PushNotifications.cancelLocalNotifications,
  cancelAllLocalNotifications: PushNotifications.cancelAllLocalNotifications,
};
export default services;
