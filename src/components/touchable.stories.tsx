import * as React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {createFakeAnalytics, createFakeVibration} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {ANALYTICS_EVENT_TYPE} from '../const';
import {Component as Touchable} from './touchable';

storiesOf('Touchable', module)
  .add('Default', () => (
    <Touchable vibration={createFakeVibration()} analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ))
  .add('Default (disabled)', () => (
    <Touchable vibration={createFakeVibration()} disabled analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ))
  .add('Without feedback', () => (
    <Touchable vibration={createFakeVibration()} isWithoutFeedback analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ))
  .add('Without feedback (disabled)', () => (
    <Touchable vibration={createFakeVibration()} disabled analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ))
  .add('Highlight', () => (
    <Touchable vibration={createFakeVibration()} isHighlight analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ))
  .add('Highlight (disabled)', () => (
    <Touchable vibration={createFakeVibration()} isHighlight analyticsID="fake-touchable">
      <Text>Foo</Text>
    </Touchable>
  ));

if (__TEST__) {
  describe('Touchable', () => {
    const analyticsID = 'fake-touchable';
    const analyticsParams = {
      foo: 'bar',
      baz: 'qux',
    };

    it('should not handle onPress', () => {
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onPress();
      expect(vibration.vibrate).not.toHaveBeenCalled();
      expect(analytics.logEvent).not.toHaveBeenCalled();
    });

    it('should handle onPress', () => {
      const handlePress = jest.fn();
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          onPress={handlePress}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PRESS, {
        id: analyticsID,
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalled();
    });

    it('should handle onPress with arguments', () => {
      const handlePress = jest.fn();
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          analyticsParams={analyticsParams}
          onPress={handlePress}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PRESS, {
        ...analyticsParams,
        id: analyticsID,
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalled();
    });

    it('should not handle onLongPress', () => {
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onLongPress();
      expect(vibration.vibrate).not.toHaveBeenCalled();
      expect(analytics.logEvent).not.toHaveBeenCalled();
    });

    it('should handle onLongPress', () => {
      const handleLongPress = jest.fn();
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          onLongPress={handleLongPress}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onLongPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.LONG_PRESS, {
        id: analyticsID,
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handleLongPress).toHaveBeenCalled();
    });

    it('should handle onLongPress with arguments', () => {
      const handleLongPress = jest.fn();
      const vibration = createFakeVibration();
      const analytics = createFakeAnalytics();
      const component = renderer.create(
        <Touchable
          vibration={vibration}
          analytics={analytics}
          analyticsID={analyticsID}
          analyticsParams={analyticsParams}
          onLongPress={handleLongPress}
          testID="touchable-fake"
        />,
      );
      const touchable = component.root.find(
        (el) => el.props.testID === 'touchable-fake' && !el.props.analytics,
      );
      touchable.props.onLongPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.LONG_PRESS, {
        ...analyticsParams,
        id: analyticsID,
      });
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handleLongPress).toHaveBeenCalled();
    });
  });
}
