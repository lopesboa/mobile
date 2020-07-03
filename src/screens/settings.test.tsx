import * as React from 'react';
import renderer from 'react-test-renderer';
import {createStoreState, createPermissionsState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
import type {ConnectedStateProps} from './settings';
import {TestContextProvider} from '../utils/tests';
import {createNavigation} from '../__fixtures__/navigation';
import {Component as Settings} from './settings';

describe('Settings -- yea', () => {

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
        permissions: createPermissionsState({
          notifications: PERMISSION_STATUS.GRANTED,
        }),
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        canReceiveNotifications: true,
        currentNotificationsPermission: PERMISSION_STATUS.GRANTED,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle toggle all notifications', () => {
    const navigation = createNavigation({});
    const toggleNotificationsPermission = jest.fn();

    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          toggleNotificationsPermission={toggleNotificationsPermission}
          />
      </TestContextProvider>
    );

    const button = component.root.find(
      el => el.props.testID === 'settings-notifications-switch-authorize-notifications',
    );
    button.props.onPress();

    expect(toggleNotificationsPermission).toHaveBeenCalledTimes(1);
  });

  it('should handle Android BackHandler', async () => {
    const {BackHandler} = require('../modules/back-handler');
    
    const navigation = createNavigation({});
    const toggleNotificationsPermission = jest.fn();

    const component = renderer.create(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          toggleNotificationsPermission={toggleNotificationsPermission}
          />
      </TestContextProvider>
    );
    
    await component?.update(
      <TestContextProvider>
        <Settings
          navigation={navigation}
          toggleNotificationsPermission={toggleNotificationsPermission}
          />
      </TestContextProvider>
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
