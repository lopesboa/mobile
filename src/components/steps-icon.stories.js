// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import StepsIcon from './steps-icon';

storiesOf('StepsIcons', module)
  .add('Computer', () => <StepsIcon iconName="computer" color="red" width={30} height={30} />)
  .add('Qr-code', () => <StepsIcon iconName="qr-code" color="red" width={30} height={30} />)
  .add('Settings', () => <StepsIcon iconName="settings" color="red" width={30} height={30} />)
  .add('Target', () => <StepsIcon iconName="target" color="red" width={30} height={30} />);
