// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import Home from './home';

storiesOf('Home', module).add('Default', () => (
  <TestContextProvider>
    <Home onChapterPress={handleFakePress} onDisciplinePress={handleFakePress} />
  </TestContextProvider>
));
