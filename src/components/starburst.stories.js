// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Starbust from './starburst';

storiesOf('Starbust', module)
  .add('Loose Light', () => (
    <Starbust spiralColor="#e13f53" backgroundColor="#e13f53" isDarkModeActivated={false} />
  ))
  .add('Loose Dark', () => (
    <Starbust spiralColor="#e13f53" backgroundColor="#e13f53" isDarkModeActivated />
  ))
  .add('Win Dark', () => (
    <Starbust spiralColor="#3db379" backgroundColor="#3db379" testID="spiral" isDarkModeActivated />
  ))
  .add('Win Light', () => (
    <Starbust
      spiralColor="#3db379"
      backgroundColor="#3db379"
      testID="spiral"
      isDarkModeActivated={false}
    />
  ));
