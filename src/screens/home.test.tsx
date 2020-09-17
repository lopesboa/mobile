import * as React from 'react';
import renderer from 'react-test-renderer';
import {Platform} from 'react-native';

import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {ENGINE, CONTENT_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../const';
import {mapStateToProps} from './home';
import type {ConnectedStateProps} from './home';

const card = createChapterCard({
  ref: 'bar',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE,
});

const notificationSettings = {
  'finish-course': {
    label: 'Currently doing reminder',
    status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
  },
  suggestion: {label: 'Course recommendations', status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED},
};

describe('Home', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'foo',
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'bar',
        },
      },
    });

    const store = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression,
      appSession: 2,
      permissions: {
        camera: 'granted',
        notifications: 'granted',
      },
      notifications: {
        settings: {
          'finish-course': {label: 'Currently doing reminder', status: 'activated'},
          suggestion: {label: 'Course recommandations', status: 'activated'},
        },
        scheduledNotifications: {
          'finish-course': [],
          suggestion: [],
        },
      },
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      appSession: 2,
      notificationStatus: 'granted',
      isFetching: false,
      isFocused: false,
      notificationSettings: {
        'finish-course': {label: 'Currently doing reminder', status: 'activated'},
        suggestion: {label: 'Course recommandations', status: 'activated'},
      },
    };
    expect(expected).toEqual(result);
  });

  it('should handle card press', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={3}
        notificationStatus="granted"
        notificationSettings={notificationSettings}
      />,
    );

    const home = component.root.find((el) => el.props.testID === 'home');
    home.props.onCardPress(card);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Slide');
    expect(selectCard).toHaveBeenCalledTimes(1);
    expect(selectCard).toHaveBeenCalledWith(card);
  });

  it('should handle search press', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        notificationSettings={notificationSettings}
      />,
    );

    const home = component.root.find((el) => el.props.testID === 'home');
    home.props.onSearchPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Search');
  });

  it('opens notify-me modal for the first time', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={1}
        notificationStatus="undetermined"
        notificationSettings={notificationSettings}
      />,
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {screen: 'NotifyMe'});
  });

  it('setup notification settings when the app has been updated and a new notification type added', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const toggle = jest.fn();
    const navigation = createNavigation({});
    const notificationSettingsIddle = {
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {label: 'Course recommendations', status: NOTIFICATION_SETTINGS_STATUS.IDLE},
    };
    renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        toggle={toggle}
        isFetching
        isFocused={false}
        appSession={1}
        notificationStatus="granted"
        notificationSettings={notificationSettingsIddle}
      />,
    );

    expect(toggle).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveBeenCalledWith('suggestion', NOTIFICATION_SETTINGS_STATUS.ACTIVATED);
  });

  it('opens notify-me modal for the first time after a component update', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={1}
        notificationStatus="blocked"
        notificationSettings={notificationSettings}
      />,
    );

    component.update(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={1}
        notificationStatus="undetermined"
        notificationSettings={notificationSettings}
      />,
    );
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {screen: 'NotifyMe'});
  });

  it('should not open notify-me modal on Android', () => {
    const {Component: Home} = require('./home');
    Platform.OS = 'android';
    const selectCard = jest.fn();
    const navigation = createNavigation({});
    renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={1}
        notificationStatus="undetermined"
        notificationSettings={notificationSettings}
      />,
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(0);
    Platform.OS = 'ios';
  });

  it('opens notify-me modal for the second time', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={10}
        notificationStatus="maybe-later"
        notificationSettings={notificationSettings}
      />,
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {screen: 'NotifyMe'});
  });

  it('opens notify-me modal for the third time', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={30}
        notificationStatus="maybe-later"
        notificationSettings={notificationSettings}
      />,
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {screen: 'NotifyMe'});
  });

  it('handles settings press', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home
        navigation={navigation}
        selectCard={selectCard}
        isFetching
        isFocused={false}
        appSession={3}
        notificationStatus="granted"
        notificationSettings={notificationSettings}
      />,
    );

    const home = component.root.find((el) => el.props.testID === 'home');
    home.props.onSettingsPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('should handle Android BackHandler', () => {
    const {Component: Home} = require('./home');
    const {BackHandler} = require('react-native');
    BackHandler.exitApp = jest.fn();
    // simulate a press on button by calling the cb function
    Home.handleBackButton();
    expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
  });
});
