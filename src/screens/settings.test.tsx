import * as React from 'react';
import renderer from 'react-test-renderer';
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

  it('handles toggle finish-course notification', () => {
    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );

    const button = component.root.find(
      (el) => el.props.testID === 'settings-notifications-switch-finish-course',
    );
    button.props.onPress();

    expect(toggleFinishCourseNotification).toHaveBeenCalledTimes(1);
  });

  it('handles Android BackHandler', async () => {
    const {BackHandler} = require('../modules/back-handler');

    const navigation = createNavigation({});
    const toggleFinishCourseNotification = jest.fn();
    const notificationsSettings = createNotificationsState();
    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
          toggleFinishCourseNotification={toggleFinishCourseNotification}
        />
      </TestContextProvider>,
    );
    await component?.update(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          notificationsSettings={notificationsSettings}
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
