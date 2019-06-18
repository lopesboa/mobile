// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import version from '../modules/version';
import Home from './home';

version.commit = 'test';

storiesOf('Home', module)
  .add('Default', () => (
    <TestContextProvider>
      <Home onCardPress={handleFakePress} onLogoLongPress={handleFakePress} isFetching={false} />
    </TestContextProvider>
  ))
  .add('Fetching', () => (
    <TestContextProvider>
      <Home onCardPress={handleFakePress} onLogoLongPress={handleFakePress} isFetching />
    </TestContextProvider>
  ));
