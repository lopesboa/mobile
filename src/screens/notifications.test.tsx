import * as React from 'react';
import renderer from 'react-test-renderer';
import {createStoreState, createPermissionsState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE, PERMISSION_STATUS} from '../const';
import {createNavigation} from '../__fixtures__/navigation';
import type {ConnectedStateProps} from './notifications';
import translations from '../translations';

const createParams = (): Params => ({
  onNotifyMe: jest.fn(),
});

describe('Notifications', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('props', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./notifications');

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
        hasPermission: true,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle Notify Me button', async () => {
    const {Component: NotifyMeScreen} = require('./notifications');

    const params = createParams();
    const navigation = createNavigation({
      params,
    });
    const requestNotificationsPermission = jest.fn(() => Promise.resolve());
    const changeNotificationsPermission = jest.fn();
    const component = renderer.create(
      <NotifyMeScreen
        navigation={navigation}
        requestNotificationsPermission={requestNotificationsPermission}
        changeNotificationsPermission={changeNotificationsPermission}
      />,
    );

    const button = component.root.find((el) => el.props.testID === 'notifyme-button');
    await button.props.onPress();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should handle maybe Later', () => {
    const {Component: NotifyMeScreen} = require('./notifications');

    const params = createParams();
    const navigation = createNavigation({
      params,
    });
    const requestNotificationsPermission = jest.fn(() => Promise.resolve());
    const changeNotificationsPermission = jest.fn();
    const component = renderer.create(
      <NotifyMeScreen
        navigation={navigation}
        requestNotificationsPermission={requestNotificationsPermission}
        changeNotificationsPermission={changeNotificationsPermission}
      />,
    );

    const button = component.root.find((el) => el.props.testID === 'notifyme-later-button');
    button.props.onPress();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
