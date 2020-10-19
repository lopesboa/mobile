import {Notifications} from '@coorpacademy/react-native-notifications';

import {NotificationType} from '../../../types';
import {NOTIFICATION_TYPE} from '../../../const';
import translations from '../../../translations';
import {ChapterCard, DisciplineCard} from '../../../layer/data/_types';

export const getNotificationWording = (type: NotificationType) => {
  const {finishCourseWordings, suggestionWordings} = translations;
  if (type === NOTIFICATION_TYPE.FINISH_COURSE) {
    return finishCourseWordings[Math.floor(Math.random() * finishCourseWordings.length)];
  }
  return suggestionWordings[Math.floor(Math.random() * suggestionWordings.length)];
};

export const calculateNotificationDeliveryDate = (index: number, daysGap: number) => {
  const NOTIFICATION_DAYS = daysGap * (index + 1);
  let currentDate: Date = new Date(Date.now());
  const delay = new Date(currentDate.setDate(currentDate.getDate() + NOTIFICATION_DAYS));
  return delay;
};

export const scheduleNotificationOnDevice = (
  type: NotificationType,
  userName: string | undefined,
  content: DisciplineCard | ChapterCard,
  date: Date,
  id: number,
) => {
  const {title, description} = getNotificationWording(type);
  if (!userName || !content.title) return;
  const notification = {
    id,
    title: title.replace('{{givenName}}', userName),
    body: description.replace(/\\/g, '').replace('{{contentName}}', content.title),
    silent: false,
    userInfo: {id: content?.universalRef, notificationType: type, content: JSON.stringify(content)},
    fireDate: +date,
  };
  Notifications.postLocalNotification(notification, id);
};
