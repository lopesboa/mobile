import * as React from 'react';
import renderer from 'react-test-renderer';
import {createStoreState, createPermissionsState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
import type { ConnectedStateProps } from './settings';
import {createNavigation} from '../__fixtures__/navigation';

describe('Settings', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('props', () => {
    it('should return the accurate props', () => {
      const { mapStateToProps } = require('./settings');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'foo'
        }
      });

      const store = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        permissions: createPermissionsState({
          notifications: PERMISSION_STATUS.GRANTED
        })
      });

      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        canReceiveNotifications: true,
        currentNotificationsPermission: PERMISSION_STATUS.GRANTED
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle toggle all notifications', () => {
    const {Component: NotifyMeScreen} = require('./settings');

    const navigation = createNavigation({});
    const toggleNotificationsPermission = jest.fn();
    let component;
    renderer.act(() => {
      component = renderer.create(
        <NotifyMeScreen 
          navigation={navigation} 
          toggleNotificationsPermission={toggleNotificationsPermission} 
        />
      );
    })

    const button = component.root.find(el => el.props.testID === 'settings-notifications-switch-authorize-notifications');
    button.props.onPress();

    expect(toggleNotificationsPermission).toHaveBeenCalledTimes(1);

  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
