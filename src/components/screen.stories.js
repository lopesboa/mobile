// @flow

import * as React from 'react';
import {Text, StyleSheet} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import Screen from './screen';

const fakeStyle = StyleSheet.create({
  screen: {
    backgroundColor: 'red',
  },
});

storiesOf('Screen', module)
  .add('Default', () => (
    <Screen>
      <Text>Foo bar baz</Text>
    </Screen>
  ))
  .add('Not scrollable', () => (
    <Screen noScroll>
      <Text>Foo bar baz</Text>
    </Screen>
  ))
  .add('With custom style', () => (
    <Screen style={fakeStyle.screen}>
      <Text>Foo bar baz</Text>
    </Screen>
  ));
