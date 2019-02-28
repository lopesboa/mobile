// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import ProgressionBar from './progression-bar';

storiesOf('ProgressionBar', module)
  .add('Default', () => <ProgressionBar current={1} count={10} />)
  .add('Custom topBarColor', () => <ProgressionBar current={1} count={10} topBarColor="#FF00FF" />);
