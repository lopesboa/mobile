import * as React from 'react';
import renderer from 'react-test-renderer';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import type { ConnectedStateProps } from './notifications';
import {createNavigation} from '../__fixtures__/navigation';

const createParams = (): Params => ({
  onNotifyMe: jest.fn()
});

describe('Notifications', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('props', () => {
    it('should return the accurate props', () => {
      const { mapStateToProps } = require('./notifications');

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
        permissions: {}
      });
      // TODO : add notification permission ? 
      const result = mapStateToProps(store);
      const expected: ConnectedStateProps = {
        hasPermission: false
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle Notify Me button', () => {
    const {Component: NotifyMeScreen} = require('./notifications');

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<NotifyMeScreen navigation={navigation} />);

    const button = component.root.find(el => el.props.testID === 'notifyme-button');
    button.props.onPress();

    expect(navigation.dispatch).toHaveBeenCalledTimes(1);

  });

  it('should handle maybe Later', () => {
    
    const { Component: NotifyMeScreen } = require('./notifications');

    const params = createParams();
    const navigation = createNavigation({
      params
    });
    const component = renderer.create(<NotifyMeScreen navigation={navigation} />);

    const button = component.root.find(el => el.props.testID === 'notifyme-later-button');
    button.props.onPress();

    expect(navigation.dispatch).toHaveBeenCalledTimes(1);
    expect(navigation.dispatch).toHaveBeenCalledWith('Mock$ReactNavigation$NavigationActions$Back');
  
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
