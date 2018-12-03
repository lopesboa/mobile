// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import Button from './button';

const fakeOnPress = handleFakePress('Button pressed');

storiesOf('Button', module)
  .add('Default', () => <Button onPress={fakeOnPress}>Here we go!</Button>)
  .add('Disabled', () => (
    <Button onPress={fakeOnPress} isDisabled>
      Here we go!
    </Button>
  ))
  .add('Loading', () => (
    <Button onPress={fakeOnPress} isLoading>
      Here we go!
    </Button>
  ));
