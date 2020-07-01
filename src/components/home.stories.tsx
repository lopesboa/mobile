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
        onSearchPress={handleFakePress}
        onSettingsPress={handleFakePress}
        isFetching={false}
        isFocused={false}
      />
    </TestContextProvider>
  ))
  .add('Fetching', () => (
    <TestContextProvider>
      <Home
        onCardPress={handleFakePress}
        isFetching
        isFocused={false}
        onSearchPress={handleFakePress}
        onSettingsPress={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Search visible', () => (
    <TestContextProvider>
      <Home
        onCardPress={handleFakePress}
        isFetching={false}
        isFocused={false}
        onSearchPress={handleFakePress}
        onSettingsPress={handleFakePress}
      />
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
            onSearchPress={handleFakePress}
            onSettingsPress={handleFakePress}
          />
        </TestContextProvider>,
      );

      const icon = component.root.find((el) => el.props.testID === 'catalog');
      icon.props.onCardPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
    });
  });
}
