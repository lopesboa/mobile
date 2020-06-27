import * as React from 'react';
import {View} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import Space from './space';

const wrapperStyle = {borderWidth: 1, alignSelf: 'center'};

storiesOf('Space', module)
  .add('Micro', () => (
    <View style={wrapperStyle}>
      <Space type="tiny" />
    </View>
  ))
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
  .add('Medium', () => (
    <View style={wrapperStyle}>
      <Space type="medium" />
    </View>
  ))
  .add('Large', () => (
    <View style={wrapperStyle}>
      <Space type="large" />
    </View>
  ))
  .add('XLarge', () => (
    <View style={wrapperStyle}>
      <Space type="xlarge" />
    </View>
  ));
