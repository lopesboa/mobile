// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import Space from './space';

storiesOf('Space', module)
  .add('Tiny', () => <Space type="tiny" />)
  .add('Small', () => <Space type="small" />)
  .add('Base', () => <Space type="base" />)
  .add('Large', () => <Space type="large" />);
