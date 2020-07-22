import {ScheduledNotificationPayload, ScheduledNotification} from '../../../types';
import {createChapterCard} from '../../../__fixtures__/cards';
import {CARD_STATUS} from '../../../layer/data/_const';
import {
  scheduleNotifications,
  unscheduleLocalNotifications,
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_NOTIFICATION,
} from './scheduled-notifications';

const createScheduledNotification = (id: string): ScheduledNotificationPayload => ({
  id,
  createdAt: new Date(),
});

const createStore = (isActive: boolean, scheduledNotifications?: ScheduledNotification) => {
  const state = {
    notifications: {
      finishCourse: {
        type: 'finish-course',
        label: 'Finish course',
        isActive: isActive,
      },
      scheduledNotifications: scheduledNotifications ?? {},
    },
  };

  const dispatch = jest.fn();
  const getState = jest.fn(() => state);
  return {
    getState,
    dispatch: jest.fn((action) => {
      if (typeof action === 'object') {
        return action;
      }
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
    }),
  };
};

jest.mock('react-native-push-notification', () => ({
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}));

describe('Scheduled notifications', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(UNSCHEDULE_NOTIFICATION, () => {
    it('unschedules all current scheduled notifications if we do not specify one', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true);

      const services = {};
      // @ts-ignore passing only needed service
      await unscheduleLocalNotifications()(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(PushNotifications.cancelAllLocalNotifications).toBeCalledTimes(1);
    });
    it('unschedules all current finish-course scheduled notifications', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true, {
        'finish-course': [createScheduledNotification('cha_fake1')],
      });

      const services = {};
      // @ts-ignore passing only needed service
      await unscheduleLocalNotifications('finish-course')(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(PushNotifications.cancelLocalNotifications).nthCalledWith(1, {id: 'cha_fake1'});
    });
  });
  describe(SCHEDULE_NOTIFICATION, () => {
    it('does not schedule notifications if there is no content', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true);

      const services = {
        NotificationContent: {
          getAllContentByMostRecent: jest.fn(() => []),
        },
      };

      // @ts-ignore passing only needed service
      await scheduleNotifications('finish-course')(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(PushNotifications.cancelLocalNotifications).toHaveBeenCalledTimes(0);
      expect(PushNotifications.localNotificationSchedule).toHaveBeenCalledTimes(0);
    });
    it('schedules a notification three times for given content(user has started 1 course)', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true);

      const services = {
        NotificationContent: {
          getAllContentByMostRecent: jest.fn(() => [
            createChapterCard({
              ref: 'cha_fake1',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
          ]),
        },
      };

      // @ts-ignore passing only needed service
      await scheduleNotifications('finish-course')(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(PushNotifications.cancelLocalNotifications).toHaveBeenCalledTimes(0);
      expect(PushNotifications.localNotificationSchedule).toHaveBeenCalledTimes(3);
      // expect(PushNotifications.localNotificationSchedule).toHaveBeenNthCalledWith(1, {
      //   id: 'cha_fake1',
      //   date: expect.any(String),
      //   ignoreInForeground: true,
      //   message: expect.any(String),
      //   title: expect.any(String),
      // });
      // expect(PushNotifications.localNotificationSchedule).toHaveBeenNthCalledWith(2, {
      //   id: 'cha_fake1',
      //   date: expect.any(String),
      //   ignoreInForeground: true,
      //   message: expect.any(String),
      //   title: expect.any(String),
      // });
      // expect(PushNotifications.localNotificationSchedule).toHaveBeenNthCalledWith(3, {
      //   id: 'cha_fake1',
      //   date: expect.any(String),
      //   ignoreInForeground: true,
      //   message: expect.any(String),
      //   title: expect.any(String),
      // });
    });
    it('schedules a notification three times for given content(user has started 2 course) and cancel existing ones', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true, {
        'finish-course': [createScheduledNotification('cha_fake1')],
      });

      const services = {
        NotificationContent: {
          getAllContentByMostRecent: jest.fn(() => [
            createChapterCard({
              ref: 'cha_fake1',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
            createChapterCard({
              ref: 'cha_fake2',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
          ]),
        },
      };
      // @ts-ignore passing only needed service
      await scheduleNotifications('finish-course')(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(PushNotifications.cancelLocalNotifications).toHaveBeenCalledTimes(1);
      expect(PushNotifications.localNotificationSchedule).toHaveBeenCalledTimes(3);
    });
    it('schedules a notification three times for given content(user has started 3 course)', async () => {
      const PushNotifications = require('react-native-push-notification');
      const {dispatch, getState} = createStore(true);

      const services = {
        NotificationContent: {
          getAllContentByMostRecent: jest.fn(() => [
            createChapterCard({
              ref: 'cha_fake1',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
            createChapterCard({
              ref: 'cha_fake2',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
            createChapterCard({
              ref: 'cha_fake3',
              completion: 0,
              title: 'Fake chapter',
              status: CARD_STATUS.ACTIVE,
            }),
          ]),
        },
      };
      // @ts-ignore passing only needed service
      await scheduleNotifications('finish-course')(dispatch, getState, {services});
      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(PushNotifications.cancelLocalNotifications).toHaveBeenCalledTimes(0);
      expect(PushNotifications.localNotificationSchedule).toHaveBeenCalledTimes(3);
    });
  });
});
