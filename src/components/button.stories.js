// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import Button from './button';

storiesOf('Button', module)
  .add('Default', () => (
    <Button onPress={handleFakePress} testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Disabled', () => (
    <Button onPress={handleFakePress} isDisabled testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Loading', () => (
    <Button onPress={handleFakePress} isLoading testID="fake-button">
      Here we go!
    </Button>
  ))
  .add('Inverted', () => (
    <Button onPress={handleFakePress} isInverted testID="fake-button">
      Here we go!
    </Button>
  ));
