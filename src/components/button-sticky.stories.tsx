import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {Component as ButtonSticky} from './button-sticky';

storiesOf('ButtonSticky', module)
  .add('Default', () => (
    <ButtonSticky onPress={handleFakePress} testID="button-fake" analyticsID="button-fake">
      Here we go!
    </ButtonSticky>
  ))
  .add('With Layout', () => (
    <ButtonSticky
      onPress={handleFakePress}
      testID="button-fake"
      layout={{
        width: 300,
        height: 400,
      }}
      analyticsID="button-fake"
    >
      Here we go!
    </ButtonSticky>
  ));
