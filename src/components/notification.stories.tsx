import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Notification from './notification';

storiesOf('Notification', module)
  .add('Default', () => <Notification />)
  .add('Custom height', () => <Notification height={16} />)
  .add('Custom color', () => <Notification color="#00CC00" />)
  .add('With label', () => <Notification height={18} color="#FF6A6A" label="1" />);
