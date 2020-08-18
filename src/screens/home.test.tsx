import * as React from 'react';
import renderer from 'react-test-renderer';
import {Platform} from 'react-native';

import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './home';
import type {ConnectedStateProps} from './home';

const card = createChapterCard({
  ref: 'bar',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE,
});

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
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      appSession: 2,
      notificationStatus: 'granted',
      isFetching: false,
      isFocused: false,
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
      <Home navigation={navigation} selectCard={selectCard} isFetching isFocused={false} />,
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
      />,
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Modals', {screen: 'NotifyMe'});
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
