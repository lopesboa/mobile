// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import Button from './button';

const fakeOnPress = handleFakePress('Button pressed');

storiesOf('Button', module)
  .add('Default', () => (
    <Button onPress={fakeOnPress} testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Disabled', () => (
    <Button onPress={fakeOnPress} isDisabled testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Loading', () => (
    <Button onPress={fakeOnPress} isLoading testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Inverted', () => (
    <Button onPress={fakeOnPress} isInverted testID="fake-button">
      Here we go!
    </Button>
  ));
