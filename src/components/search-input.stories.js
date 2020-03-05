// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import {handleFakePress} from '../utils/tests';
import SearchInput from './search-input';

storiesOf('SearchInput', module)
  .add('Default', () => <SearchInput onChange={handleFakePress} />)
  .add('With text', () => <SearchInput value="Foo" onChange={handleFakePress} />)
  .add('Fetching', () => <SearchInput value="Foo" isFetching onChange={handleFakePress} />);

if (__TEST__) {
  describe('SearchInput', () => {
    it('should handle onClear', () => {
      const handleChange = jest.fn();
      const component = renderer.create(<SearchInput value="foo" onChange={handleChange} />);

      const icon = component.root.find(el => el.props.testID === 'search-input-clear');
      icon.props.onPress();

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('should handle onChange', () => {
      const handleChange = jest.fn();
      const value = 'foo';
      const component = renderer.create(<SearchInput onChange={handleChange} />);

      const input = component.root.find(el => el.props.testID === 'search-input-field');
      input.props.onChangeText(value);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(value);
    });
  });
}
