import * as React from 'react';
import renderer from 'react-test-renderer';
import {PermissionStatus} from '../types';
import {
  createStoreState,
  createPermissionsState,
  createNotificationsState,
} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS, NOTIFICATION_TYPE} from '../const';
import {TestContextProvider} from '../utils/tests';
import {createNavigation} from '../__fixtures__/navigation';
import type {ConnectedStateProps} from './settings';
import {Component as Settings} from './settings';

describe('Settings', () => {
  describe('props', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./settings');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'foo',
        },
      });

      const store = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        notifications: {
          finishCourse: {
            type: NOTIFICATION_TYPE.FINISH_COURSE,
            label: 'Reminder',
            isActive: false,
          },
        },
        permissions: createPermissionsState({
          notifications: PERMISSION_STATUS.GRANTED,
        }),
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        canReceiveNotifications: true,
        currentNotificationsPermission: PERMISSION_STATUS.GRANTED,
        notificationsSettings: {
          finishCourse: {
            type: NOTIFICATION_TYPE.FINISH_COURSE,
            label: 'Reminder',
            isActive: false,
          },
        },
      };

      expect(result).toEqual(expected);
    });
  });

  it('sets finish-course notification to false if notification permission is not granted', async () => {
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const requestNotificationsPermission = jest.fn(() =>
      Promise.resolve('denied'),
    ) as () => Promise<PermissionStatus>;
    renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          canReceiveNotifications={false}
          notificationsSettings={notificationsSettings}
          requestNotificationsPermission={requestNotificationsPermission}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );

    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
    expect(toggleFinishCourseNotification).toHaveBeenCalledWith(false);
  });

  it('toggles finish-course notification if notification permission is granted', async () => {
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const requestNotificationsPermission = jest.fn(() =>
      Promise.resolve('granted'),
    ) as () => Promise<PermissionStatus>;
    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
          canReceiveNotifications
          requestNotificationsPermission={requestNotificationsPermission}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );

    const button = component.root.find((el) => el.props.testID === 'settings-notifications');
    await button.props.onSettingToggle('finish-course');

    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
    expect(requestNotificationsPermission).toHaveBeenCalledTimes(0);
  });

  it('does not toggles finish-course notification if notification permission is not granted', async () => {
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const requestNotificationsPermission = jest.fn(() =>
      Promise.resolve('granted'),
    ) as () => Promise<PermissionStatus>;
    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
          canReceiveNotifications={false}
          requestNotificationsPermission={requestNotificationsPermission}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );

    const button = component.root.find((el) => el.props.testID === 'settings-notifications');
    await button.props.onSettingToggle('finish-course');

    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
    expect(requestNotificationsPermission).toHaveBeenCalledTimes(1);
  });

  it('handles Android BackHandler', () => {
    const BackHandlerModule = require('../containers/with-backhandler');
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const requestNotificationsPermission = jest.fn(() =>
      Promise.resolve('granted'),
    ) as () => Promise<PermissionStatus>;
    jest.spyOn(BackHandlerModule, 'useBackHandler').mockImplementation((cb) => cb());
    renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
          canReceiveNotifications
          requestNotificationsPermission={requestNotificationsPermission}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
