// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {handleFakePress} from '../utils/tests';
import ButtonFooter from './button-sticky';

storiesOf('Button Footer', module)
  .add('Default', () => (
    <ButtonFooter onPress={handleFakePress} testID="fake-button">
      Here we go!
    </ButtonFooter>
  ))
  .add('With Layout', () => (
    <ButtonFooter
      onPress={handleFakePress}
      testID="fake-button"
      layout={{
        width: 300,
        height: 400
      }}
    >
      Here we go!
    </ButtonFooter>
  ));
