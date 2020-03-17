// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider, handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';

import Header from './header';

storiesOf('Header', module)
  .add('Default', () => (
    <TestContextProvider>
      <Header height={67} onSearchPress={handleFakePress} onLogoLongPress={handleFakePress} />
    </TestContextProvider>
  ))
  .add('Search visible', () => (
    <TestContextProvider>
      <Header height={67} onSearchPress={handleFakePress} onLogoLongPress={handleFakePress} />
    </TestContextProvider>
  ))
  .add('With search value', () => (
    <TestContextProvider>
      <Header height={67} onSearchPress={handleFakePress} onLogoLongPress={handleFakePress} />
    </TestContextProvider>
  ))
  .add('Searching', () => (
    <TestContextProvider>
      <Header height={67} onSearchPress={handleFakePress} onLogoLongPress={handleFakePress} />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Header', () => {
    it('should handle onSearchPress on magnifier icon', () => {
      const handleSearchToggle = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Header
            height={67}
            onSearchPress={handleSearchToggle}
            onLogoLongPress={handleFakePress}
          />
        </TestContextProvider>
      );

      const icon = component.root.find(el => el.props.testID === 'search-icon');
      icon.props.onPress();

      expect(handleSearchToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle onLogoLongPress', () => {
      const handleLogoLongPress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <Header
            height={67}
            onSearchPress={handleFakePress}
            onLogoLongPress={handleLogoLongPress}
          />
        </TestContextProvider>
      );

      const input = component.root.find(el => el.props.testID === 'header-logo');
      input.props.onLongPress();

      expect(handleLogoLongPress).toHaveBeenCalledTimes(1);
    });
  });
}
