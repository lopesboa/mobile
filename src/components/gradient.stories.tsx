import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Gradient from './gradient';

storiesOf('Gradient', module).add('Default', () => (
  <Gradient colors={['#fff']} height={42} testID="gradient" />
));
