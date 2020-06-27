import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Notification from './notification';

storiesOf('Notification', module)
  .add('Default', () => <Notification />)
  .add('Custom height', () => <Notification height={16} />);
