// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {Component as HeartBroken} from './heart-broken';

storiesOf('Heart Broken', module)
  .add('Default Dark', () => <HeartBroken isDarkModeActivated />)
  .add('Default Light', () => <HeartBroken isDarkModeActivated={false} />);
