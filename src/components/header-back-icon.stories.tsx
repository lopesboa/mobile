import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import HeaderBackIcon from './header-back-icon';

storiesOf('HeaderBackIcon', module)
  .add('Default', () => <HeaderBackIcon />)
  .add('Custom props', () => <HeaderBackIcon color="#0ff" height={20} width={20} />);
