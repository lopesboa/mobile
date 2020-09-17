import * as React from 'react';
import renderer from 'react-test-renderer';
import {PermissionStatus} from '../types';
import {
  createStoreState,
  createPermissionsState,
  createNotificationsState,
} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {
  ENGINE,
  CONTENT_TYPE,
  PERMISSION_STATUS,
  NOTIFICATION_TYPE,
  NOTIFICATION_SETTINGS_STATUS,
} from '../const';
import {TestContextProvider} from '../utils/tests';
import {createNavigation} from '../__fixtures__/navigation';
import type {ConnectedStateProps} from './settings';
import {Component as Settings, transformNotificationSettings} from './settings';

describe('Settings', () => {
  describe('transformNotificationSettings', () => {
    it('keeps the order of the elements', () => {
      const expected = [
        {
          label: 'Reminder',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          type: 'finish-course',
        },
        {
          label: 'Suggestion',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          type: 'suggestion',
        },
      ];
      const result = transformNotificationSettings({
        'finish-course': {
          label: 'Reminder',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
        suggestion: {
          label: 'Suggestion',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      });
      expect(result).toEqual(expected);
    });
    it('reorders the elements', () => {
      const expected = [
        {
          label: 'Reminder',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          type: 'finish-course',
        },
        {
          label: 'Suggestion',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          type: 'suggestion',
        },
      ];
      const result = transformNotificationSettings({
        suggestion: {
          label: 'Suggestion',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
        'finish-course': {
          label: 'Reminder',
          status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      });
      expect(result).toEqual(expected);
    });
  });
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
          settings: {
            'finish-course': {
              label: 'Reminder',
              status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
            },
            suggestion: {
              label: 'Suggestion',
              status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
            },
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
          'finish-course': {
            label: 'Reminder',
            status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          },
          suggestion: {
            label: 'Suggestion',
            status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
          },
        },
      };

      expect(result).toEqual(expected);
    });
  });

  it('sets finish-course notification to false if notification permission is not granted', async () => {
    const navigation = createNavigation({});
    const toggleNotificationSetting = jest.fn();
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
          toggleNotificationSetting={toggleNotificationSetting}
        />
      </TestContextProvider>,
    );

    expect(toggleNotificationSetting).toHaveBeenCalledTimes(2);
    expect(toggleNotificationSetting).nthCalledWith(
      1,
      NOTIFICATION_TYPE.FINISH_COURSE,
      NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
    );
    expect(toggleNotificationSetting).nthCalledWith(
      2,
      NOTIFICATION_TYPE.SUGGESTION,
      NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
    );
  });

  it('toggles finish-course and suggestion notification if notification permission is granted', async () => {
    const navigation = createNavigation({});
    const toggleNotificationSetting = jest.fn();
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
          toggleNotificationSetting={toggleNotificationSetting}
        />
      </TestContextProvider>,
    );

    const button = component.root.find((el) => el.props.testID === 'settings-notifications');
    await button.props.onSettingToggle(NOTIFICATION_TYPE.FINISH_COURSE);
    await button.props.onSettingToggle(NOTIFICATION_TYPE.SUGGESTION);

    expect(toggleNotificationSetting).toHaveBeenCalledTimes(2);
    expect(toggleNotificationSetting).toHaveBeenCalledTimes(2);
    expect(requestNotificationsPermission).toHaveBeenCalledTimes(0);
  });

  it('does not toggles finish-course and suggestion notification if notification permission is not granted', async () => {
    const navigation = createNavigation({});
    const toggleNotificationSetting = jest.fn();
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
          toggleNotificationSetting={toggleNotificationSetting}
        />
      </TestContextProvider>,
    );

    const button = component.root.find((el) => el.props.testID === 'settings-notifications');
    await button.props.onSettingToggle(NOTIFICATION_TYPE.FINISH_COURSE);
    await button.props.onSettingToggle(NOTIFICATION_TYPE.SUGGESTION);

    expect(toggleNotificationSetting).toHaveBeenCalledTimes(2);
    expect(toggleNotificationSetting).toHaveBeenCalledTimes(2);
    expect(requestNotificationsPermission).toHaveBeenCalledTimes(2);
  });

  it('handles Android BackHandler', () => {
    const BackHandlerModule = require('../containers/with-backhandler');
    const navigation = createNavigation({});
    const toggleNotificationSetting = jest.fn();
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
          toggleNotificationSetting={toggleNotificationSetting}
        />
      </TestContextProvider>,
    );
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
