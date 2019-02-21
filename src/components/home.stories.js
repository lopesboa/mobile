// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import version from '../modules/version';
import Home from './home';

storiesOf('Home', module).add('Default', () => {
  version.commit = 'test';

  return (
    <TestContextProvider>
      <Home onChapterPress={handleFakePress} onDisciplinePress={handleFakePress} />
    </TestContextProvider>
  );
});
