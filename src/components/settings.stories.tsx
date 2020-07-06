import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import Settings from './settings';

storiesOf('Settings', module).add('default', () => (
  <Settings
    settings={[
      {
        type: 'authorize-notifications',
        label: 'Authorize notifications',
        onPress: handleFakePress,
        isActive: true,
      },
      {type: 'new-courses', label: 'New courses', onPress: handleFakePress, isActive: false},
      {type: 'new-battles', label: 'New battles', onPress: handleFakePress, isActive: true},
    ]}
  />
));
