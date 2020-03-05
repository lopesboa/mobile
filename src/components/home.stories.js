// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import Home from './home';

storiesOf('Home', module)
  .add('Default', () => (
    <TestContextProvider>
      <Home
        onCardPress={handleFakePress}
        isFetching={false}
        isFocused={false}
        isSearchVisible={false}
      />
    </TestContextProvider>
  ))
  .add('Fetching', () => (
    <TestContextProvider>
      <Home onCardPress={handleFakePress} isFetching isFocused={false} isSearchVisible={false} />
    </TestContextProvider>
  ))
  .add('Search visible', () => (
    <TestContextProvider>
      <Home onCardPress={handleFakePress} isFetching={false} isFocused={false} isSearchVisible />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Home', () => {
    it('should handle onCardPress on Catalog', () => {
      const handleCardPress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Home
            onCardPress={handleCardPress}
            isFetching={false}
            isFocused={false}
            isSearchVisible={false}
          />
        </TestContextProvider>
      );

      const icon = component.root.find(el => el.props.testID === 'catalog');
      icon.props.onCardPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
    });

    it('should handle onCardPress on CatalogSearch', () => {
      const handleCardPress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Home
            onCardPress={handleCardPress}
            isFetching={false}
            isFocused={false}
            isSearchVisible
          />
        </TestContextProvider>
      );

      const icon = component.root.find(el => el.props.testID === 'catalog-search');
      icon.props.onCardPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
    });
  });
}
