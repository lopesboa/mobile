// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {Component as Progression} from './progression';

storiesOf('Progression', module)
  .add('Default Dark', () => <Progression current={1} count={10} isDarkModeActivated />)
  .add('Default Light', () => <Progression current={1} count={10} isDarkModeActivated={false} />);
