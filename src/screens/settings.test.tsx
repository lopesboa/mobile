import * as React from 'react';
import renderer from 'react-test-renderer';
import {PermissionStatus} from '../types';
import {
  createStoreState,
  createPermissionsState,
  createNotificationsState,
} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
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
            type: 'finish-course',
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
            type: 'finish-course',
            label: 'Reminder',
            isActive: false,
          },
        },
      };

      expect(result).toEqual(expected);
    });
  });

  it('does not toggles finish-course notification if notification permission is not granted', async () => {
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const requestNotificationsPermission = jest.fn(() =>
      Promise.resolve('denied'),
    ) as () => Promise<PermissionStatus>;
    const component = renderer.create(
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

    const button = component.root.find(
      (el) => el.props.testID === 'settings-notifications-switch-finish-course',
    );
    await button.props.onPress();
    expect(toggleFinishCourseNotification).toHaveBeenCalledWith(false);
    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
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

    const button = component.root.find(
      (el) => el.props.testID === 'settings-notifications-switch-finish-course',
    );
    await button.props.onPress();

    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
  });

  it('handles Android BackHandler', async () => {
    const {BackHandler} = require('../modules/back-handler');

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
    await component?.update(
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
    // simulate a press on button by calling the cb function
    BackHandler.addEventListener.mock.calls[0][1]();
    component?.unmount();
    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
