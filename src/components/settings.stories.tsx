import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import {__TEST__} from '../modules/environment';
import {ANALYTICS_EVENT_TYPE, NOTIFICATION_TYPE} from '../const';
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
        isActive: false,
      },
    ]}
  />
));

if (__TEST__) {
  describe('Settings', () => {
    it('should handle onSettingToggle', () => {
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
              isActive: false,
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
        value: false,
      });
      expect(onSettingToggle).nthCalledWith(1, 'finish-course');
    });
  });
}
