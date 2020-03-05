// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import HeaderBackButton from './header-back-button';

storiesOf('HeaderBackButton', module)
  .add('Close', () => (
    <HeaderBackButton type="close" onPress={handleFakePress} testID="header-close-button" />
  ))
  .add('Back', () => (
    <HeaderBackButton type="back" onPress={handleFakePress} testID="header-back-button" />
  ))
  .add('Home', () => (
    <HeaderBackButton type="home" onPress={handleFakePress} testID="header-back-button" />
  ))
  .add('Custom color', () => (
    <HeaderBackButton
      type="close"
      onPress={handleFakePress}
      color="#000"
      testID="header-close-button"
    />
  ))
  .add('No safe area', () => (
    <HeaderBackButton
      type="close"
      onPress={handleFakePress}
      color="#000"
      noSafeArea
      testID="header-close-button"
    />
  ))
  .add('Not floating', () => (
    <HeaderBackButton
      type="close"
      onPress={handleFakePress}
      color="#000"
      isFloating={false}
      testID="header-close-button"
    />
  ));
