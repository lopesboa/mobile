import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import Settings from './settings';
import {NOTIFICATION_TYPE} from '../const';

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
