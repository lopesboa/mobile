// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import Home from './home';

storiesOf('Home', module)
  .add('Default', () => (
    <TestContextProvider>
      <Home
        onCardPress={handleFakePress}
        onLogoLongPress={handleFakePress}
        isFetching={false}
        isFocused={false}
      />
    </TestContextProvider>
  ))
  .add('Fetching', () => (
    <TestContextProvider>
      <Home
        onCardPress={handleFakePress}
        onLogoLongPress={handleFakePress}
        isFetching
        isFocused={false}
      />
    </TestContextProvider>
  ));
