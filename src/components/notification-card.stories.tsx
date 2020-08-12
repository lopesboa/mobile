import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import NotificationCard from './notification-card';

storiesOf('NotificationCard', module)
  .add('Default', () => <NotificationCard />)
