// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createNavigation} from '../__fixtures__/navigation';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {ENGINE, CONTENT_TYPE} from '../const';
import translations from '../translations';
import {mapStateToProps} from './home';
import type {ConnectedStateProps} from './home';

const card = createChapterCard({
  ref: 'bar',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE
});

describe('Home', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'foo'
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'bar'
        }
      }
    });

    const store = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      isFetching: false
    };
    expect(expected).toEqual(result);
  });

  it('should handle card press', () => {
    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home navigation={navigation} selectCard={selectCard} isFetching />
    );

    const home = component.root.find(el => el.props.testID === 'home');
    home.props.onCardPress(card);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Slide');
    expect(selectCard).toHaveBeenCalledTimes(1);
    expect(selectCard).toHaveBeenCalledWith(card);
  });

  it('should handle logo long press', () => {
    const {Alert} = require('react-native');
    const alert = jest.spyOn(Alert, 'alert');

    const {Component: Home} = require('./home');

    const selectCard = jest.fn();
    const signOut = jest.fn();
    const navigation = createNavigation({});
    const component = renderer.create(
      <Home navigation={navigation} selectCard={selectCard} signOut={signOut} isFetching />
    );

    alert.mockImplementationOnce((title, message, buttons) => {
      expect(title).toEqual(translations.logOut);
      expect(message).toBeNil;
      expect(buttons).toEqual([
        {
          text: translations.cancel
        },
        {
          text: translations.ok,
          onPress: expect.any(Function)
        }
      ]);

      const {onPress} = buttons[1];

      onPress();

      expect(signOut).toHaveBeenCalledTimes(1);
    });

    const home = component.root.find(el => el.props.testID === 'home');
    home.props.onLogoLongPress();

    expect(alert).toHaveBeenCalledTimes(1);
  });
});
