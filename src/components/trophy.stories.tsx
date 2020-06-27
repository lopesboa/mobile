import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Trophy from './trophy';

storiesOf('Trophy', module)
  .add('Default', () => <Trophy />)
  .add('Win', () => <Trophy style={{color: '#e13f53'}} />);
