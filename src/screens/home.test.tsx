import * as React from 'react';
import renderer from 'react-test-renderer';

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
      <Home navigation={navigation} selectCard={selectCard} isFetching isFocused={false} />,
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

  it('handles settings press', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home navigation={navigation} selectCard={selectCard} isFetching isFocused={false} />,
    );

    const home = component.root.find((el) => el.props.testID === 'home');
    home.props.onSettingsPress();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('should handle Android BackHandler', () => {
    const {Component: Home} = require('./home');
    const {BackHandler} = require('../modules/back-handler');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home navigation={navigation} selectCard={selectCard} isFetching isFocused={false} />,
    );
    // simulate a press on button by calling the cb function
    BackHandler.addEventListener.mock.calls[0][1]();
    component.unmount();

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
    expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );
  });
});
