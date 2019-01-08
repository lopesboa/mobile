// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {Component as Progression} from './progression';

storiesOf('Progression', module)
  .add('Default', () => <Progression current={1} count={10} />)
  .add('Empty', () => <Progression />);
