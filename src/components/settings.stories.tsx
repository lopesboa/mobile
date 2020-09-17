import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import {__TEST__} from '../modules/environment';
import {ANALYTICS_EVENT_TYPE, NOTIFICATION_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../const';
import {createFakeAnalytics} from '../utils/tests';
import {Component as Settings} from './settings';

async function handleFakePressP() {
  await Promise.resolve();
}
storiesOf('Settings', module).add('default', () => (
  <Settings
    onSettingToggle={handleFakePressP}
    testID="settings"
    settings={[
      {
        type: NOTIFICATION_TYPE.FINISH_COURSE,
        label: 'New courses',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    ]}
  />
));

if (__TEST__) {
  describe('Settings', () => {
    it('should handle onSettingToggle for finish-course', () => {
      const analytics = createFakeAnalytics();
      const onSettingToggle = jest.fn();
      const component = renderer.create(
        <Settings
          onSettingToggle={onSettingToggle}
          testID="settings"
          settings={[
            {
              type: NOTIFICATION_TYPE.FINISH_COURSE,
              label: 'New courses',
              status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
            },
          ]}
          analytics={analytics}
        />,
      );
      const switchComponent = component.root.find(
        (el) => el.props.testID === 'settings-switch-finish-course',
      );
      switchComponent.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_TOGGLE, {
        type: 'finish-course',
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      });
      expect(onSettingToggle).nthCalledWith(1, 'finish-course');
    });
    it('should handle onSettingToggle for suggestion', () => {
      const analytics = createFakeAnalytics();
      const onSettingToggle = jest.fn();
      const component = renderer.create(
        <Settings
          onSettingToggle={onSettingToggle}
          testID="settings"
          settings={[
            {
              type: NOTIFICATION_TYPE.FINISH_COURSE,
              label: 'New courses',
              status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
            },
            {
              type: NOTIFICATION_TYPE.SUGGESTION,
              label: 'Suggestion course',
              status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
            },
          ]}
          analytics={analytics}
        />,
      );
      const switchComponent = component.root.find(
        (el) => el.props.testID === 'settings-switch-suggestion',
      );
      switchComponent.props.onPress();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.NOTIFICATIONS_TOGGLE, {
        type: 'suggestion',
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      });
      expect(onSettingToggle).nthCalledWith(1, 'suggestion');
    });
  });
}
