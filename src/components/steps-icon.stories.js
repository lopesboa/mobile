// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import StepsIcon from './steps-icon';

storiesOf('StepsIcons', module).add('Computer', () => (
  <StepsIcon iconName="computer" color="red" width={30} height={30} />
));
