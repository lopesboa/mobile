// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress, createFakeAnalytics, createFakeVibration} from '../utils/tests';
import {ANALYTICS_EVENT_TYPE} from '../const';
import {__TEST__} from '../modules/environment';
import {Component as Button} from './button';

storiesOf('Button', module)
  .add('Default', () => (
    <Button
      onPress={handleFakePress}
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('Disabled', () => (
    <Button
      onPress={handleFakePress}
      isDisabled
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('Loading', () => (
    <Button
      onPress={handleFakePress}
      isLoading
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('Inverted', () => (
    <Button
      onPress={handleFakePress}
      isInverted
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('Secondary', () => (
    <Button
      onPress={handleFakePress}
      isSecondary
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('Secondary Inverted', () => (
    <Button
      onPress={handleFakePress}
      isSecondary
      isInverted
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ))
  .add('TextSecondary', () => (
    <Button
      onPress={handleFakePress}
      isTextSecondary
      testID="fake-button"
      vibration={createFakeVibration()}
      analytics={createFakeAnalytics()}
      analyticsID="fake-button"
    >
      Here we go!
    </Button>
  ));

if (__TEST__) {
  describe('Button', () => {
    it('should handle onPress', () => {
      const handlePress = jest.fn();
      const analytics = createFakeAnalytics();
      const analyticsID = 'fake-button';
      const vibration = createFakeVibration();
      const component = renderer.create(
        <Button
          onPress={handlePress}
          isTextSecondary
          testID="fake-button"
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
        >
          Here we go!
        </Button>
      );
      const button = component.root.find(el => el.props.testID === 'fake-button-native');
      button.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PRESS, {
        id: analyticsID
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalled();
    });

    it('should handle onPress with arguments', () => {
      const handlePress = jest.fn();
      const analytics = createFakeAnalytics();
      const analyticsID = 'fake-button';
      const vibration = createFakeVibration();
      const analyticsParams = {
        foo: 'bar',
        baz: 'qux'
      };
      const component = renderer.create(
        <Button
          onPress={handlePress}
          isTextSecondary
          testID="fake-button"
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          analyticsParams={analyticsParams}
        >
          Here we go!
        </Button>
      );
      const button = component.root.find(el => el.props.testID === 'fake-button-native');
      button.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PRESS, {
        ...analyticsParams,
        id: analyticsID
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalled();
    });
  });
}
