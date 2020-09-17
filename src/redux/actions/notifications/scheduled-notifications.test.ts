import {NOTIFICATION_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../../../const';
import {ScheduledNotificationPayload, ScheduledNotification} from '../../../types';
import {createChapterCard} from '../../../__fixtures__/cards';
import {CARD_STATUS} from '../../../layer/data/_const';
import {
  scheduleNotifications,
  unscheduleLocalNotifications,
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_NOTIFICATION,
} from './scheduled-notifications';

const createScheduledNotification = (
  id: number,
  courseID: string,
): ScheduledNotificationPayload => ({
  id,
  createdAt: new Date(),
  courseID,
});

const createStore = ({
  isFinishCourseSettingActive = false,
  isSuggestionSettingActive = false,
  scheduledNotifications,
}: {
  isFinishCourseSettingActive?: boolean;
  isSuggestionSettingActive?: boolean;
  scheduledNotifications?: ScheduledNotification;
}) => {
  const state = {
    authentication: {
      user: {
        givenName: 'Coorpacademy',
      },
    },
    notifications: {
      settings: {
        'finish-course': {
          label: 'Finish course',
          status: isFinishCourseSettingActive
            ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
            : NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
        suggestion: {
          label: 'Suggestion course',
          status: isSuggestionSettingActive
            ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
            : NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
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

jest.mock('@coorpacademy/react-native-notifications', () => ({
  Notifications: {
    events: jest.fn(() => ({
      registerNotificationReceivedForeground: jest.fn(),
      registerNotificationOpened: jest.fn(),
    })),
    postLocalNotification: jest.fn(),
    cancelLocalNotification: jest.fn(),
    getInitialNotification: jest.fn(),
    registerRemoteNotifications: jest.fn(),
  },
}));

describe('Scheduled notifications', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(UNSCHEDULE_NOTIFICATION, () => {
    describe(NOTIFICATION_TYPE.FINISH_COURSE, () => {
      it('unschedules all current finish-course scheduled notifications', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({
          isFinishCourseSettingActive: true,
          scheduledNotifications: {'finish-course': [createScheduledNotification(1, 'cha_fake1')]},
        });

        const services = {
          Analytics: {
            logEvent: jest.fn(),
          },
        };
        // @ts-ignore passing only needed service
        await unscheduleLocalNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledWith(1);
        expect(services.Analytics.logEvent).toHaveBeenCalledWith('notifications', {
          id: 'unschedule',
          type: 'finish-course',
          value: 1,
        });
      });
    });

    describe(NOTIFICATION_TYPE.SUGGESTION, () => {
      it('unschedules all current suggestion scheduled notifications', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({
          isSuggestionSettingActive: true,
          scheduledNotifications: {suggestion: [createScheduledNotification(1, 'cha_fake1')]},
        });

        const services = {
          Analytics: {
            logEvent: jest.fn(),
          },
        };
        // @ts-ignore passing only needed service
        await unscheduleLocalNotifications('suggestion')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledWith(1);
        expect(services.Analytics.logEvent).toHaveBeenCalledWith('notifications', {
          id: 'unschedule',
          type: 'suggestion',
          value: 1,
        });
      });
    });
  });

  describe(SCHEDULE_NOTIFICATION, () => {
    describe(NOTIFICATION_TYPE.FINISH_COURSE, () => {
      it('does not schedule finish-course notifications if there is no content', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isFinishCourseSettingActive: true});

        const services = {
          NotificationContent: {
            getAllContentByMostRecent: jest.fn(() => []),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });

      it('does not schedule notifications if finish-course notification is disabled', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isFinishCourseSettingActive: false});

        const services = {
          NotificationContent: {
            getAllContentByMostRecent: jest.fn(() => [
              createChapterCard({
                ref: 'cha_fake1',
                completion: 0,
                status: CARD_STATUS.ACTIVE,
                // @ts-ignore for testing purpose
                title: undefined,
              }),
            ]),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });

      it('does not schedule notifications finish-course if there is no content title', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isFinishCourseSettingActive: true});

        const services = {
          NotificationContent: {
            getAllContentByMostRecent: jest.fn(() => [
              createChapterCard({
                ref: 'cha_fake1',
                completion: 0,
                status: CARD_STATUS.ACTIVE,
                // @ts-ignore for testing purpose
                title: undefined,
              }),
            ]),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });
      it('schedules a notification three times for given content(user has started 1 course)', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isFinishCourseSettingActive: true});

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
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(3);
        expect(services.Analytics.logEvent).nthCalledWith(1, 'notifications', {
          id: 'unschedule',
          type: 'finish-course',
          value: 1,
        });
        expect(services.Analytics.logEvent).nthCalledWith(2, 'notifications', {
          id: 'schedule',
          type: 'finish-course',
          value: 1,
        });
      });
      it('schedules a notification three times for given content(user has started 2 course) and cancel existing ones', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({
          isFinishCourseSettingActive: true,
          scheduledNotifications: {'finish-course': [createScheduledNotification(2, 'cha_fake1')]},
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
          Analytics: {
            logEvent: jest.fn(),
          },
        };
        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(1);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(3);
        expect(services.Analytics.logEvent).nthCalledWith(1, 'notifications', {
          id: 'unschedule',
          type: 'finish-course',
          value: 1,
        });
        expect(services.Analytics.logEvent).nthCalledWith(2, 'notifications', {
          id: 'schedule',
          type: 'finish-course',
          value: 1,
        });
      });
      it('schedules a notification three times for given content(user has started 3 course)', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isFinishCourseSettingActive: true});

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
          Analytics: {
            logEvent: jest.fn(),
          },
        };
        // @ts-ignore passing only needed service
        await scheduleNotifications('finish-course')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(3);
        expect(services.Analytics.logEvent).nthCalledWith(1, 'notifications', {
          id: 'unschedule',
          type: 'finish-course',
          value: 1,
        });
        expect(services.Analytics.logEvent).nthCalledWith(2, 'notifications', {
          id: 'schedule',
          type: 'finish-course',
          value: 1,
        });
      });
    });
    describe(NOTIFICATION_TYPE.SUGGESTION, () => {
      it('does not schedule suggestion notifications if there is no content', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isSuggestionSettingActive: true});

        const services = {
          NotificationContent: {
            getRecommendationContent: jest.fn(() => undefined),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('suggestion')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });

      it('does not schedule notifications if suggestion notification setting is disabled', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isSuggestionSettingActive: false});

        const services = {
          NotificationContent: {
            getRecommendationContent: jest.fn(() =>
              createChapterCard({
                ref: 'cha_fake1',
                completion: 0,
                status: CARD_STATUS.ACTIVE,
                // @ts-ignore for testing purpose
                title: undefined,
              }),
            ),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('suggestion')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });

      it('does not schedule notifications suggestion if there is no content title', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isSuggestionSettingActive: true});

        const services = {
          NotificationContent: {
            getRecommendationContent: jest.fn(() =>
              createChapterCard({
                ref: 'cha_fake1',
                completion: 0,
                status: CARD_STATUS.ACTIVE,
                // @ts-ignore for testing purpose
                title: undefined,
              }),
            ),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('suggestion')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(8);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(0);
      });
      it('schedules a notification seven times for given content', async () => {
        const {Notifications} = require('@coorpacademy/react-native-notifications');
        const {dispatch, getState} = createStore({isSuggestionSettingActive: true});

        const services = {
          NotificationContent: {
            getRecommendationContent: jest.fn(() =>
              createChapterCard({
                ref: 'cha_fake1',
                completion: 0,
                title: 'Fake chapter',
                status: CARD_STATUS.ACTIVE,
              }),
            ),
          },
          Analytics: {
            logEvent: jest.fn(),
          },
        };

        // @ts-ignore passing only needed service
        await scheduleNotifications('suggestion')(dispatch, getState, {services});
        expect(dispatch).toHaveBeenCalledTimes(8);
        expect(Notifications.cancelLocalNotification).toHaveBeenCalledTimes(0);
        expect(Notifications.postLocalNotification).toHaveBeenCalledTimes(7);
        expect(services.Analytics.logEvent).nthCalledWith(1, 'notifications', {
          id: 'unschedule',
          type: 'suggestion',
          value: 1,
        });
        expect(services.Analytics.logEvent).nthCalledWith(2, 'notifications', {
          id: 'schedule',
          type: 'suggestion',
          value: 1,
        });
      });
    });
  });
});
