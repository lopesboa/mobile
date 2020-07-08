import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import Settings from './settings';

async function handleFakePressP() {
  await Promise.resolve();
}
storiesOf('Settings', module).add('default', () => (
  <Settings
    onSettingToggle={handleFakePressP}
    testID="settings"
    settings={[
      {
        type: 'finish-course',
        label: 'New courses',
        isActive: false,
      },
    ]}
  />
));
