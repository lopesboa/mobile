// @flow

import * as React from 'react';
import {View} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import Space from './space';

const wrapperStyle = {borderWidth: 1, alignSelf: 'center'};

storiesOf('Space', module)
  .add('Tiny', () => (
    <View style={wrapperStyle}>
      <Space type="tiny" />
    </View>
  ))
  .add('Small', () => (
    <View style={wrapperStyle}>
      <Space type="small" />
    </View>
  ))
  .add('Base', () => (
    <View style={wrapperStyle}>
      <Space type="base" />
    </View>
  ))
  .add('Large', () => (
    <View style={wrapperStyle}>
      <Space type="large" />
    </View>
  ));
