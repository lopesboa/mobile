import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import Search from './search';

storiesOf('Search', module)
  .add('Default', () => (
    <TestContextProvider>
      <Search
        searchValue=""
        onSearchInputChange={handleFakePress}
        isSearchFetching={false}
        onCardPress={handleFakePress}
        onBackPress={handleFakePress}
        testID="search"
      />
    </TestContextProvider>
  ))
  .add('Searching', () => (
    <TestContextProvider>
      <Search
        searchValue="data viz"
        onSearchInputChange={handleFakePress}
        isSearchFetching
        onCardPress={handleFakePress}
        onBackPress={handleFakePress}
      />
    </TestContextProvider>
  ));
