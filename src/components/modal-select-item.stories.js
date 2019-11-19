// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import ModalSelectItem from './modal-select-item';

storiesOf('ModalSelectItem', module)
  .add('Default', () => <ModalSelectItem onPress={handleFakePress}>Foo</ModalSelectItem>)
  .add('Selected', () => (
    <ModalSelectItem onPress={handleFakePress} isSelected>
      Foo
    </ModalSelectItem>
  ));

if (__TEST__) {
  describe('ModalSelectItem', () => {
    it('should handle press', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <ModalSelectItem onPress={handlePress} testID="modal-select-item-1">
          Foo
        </ModalSelectItem>
      );

      const button = component.root.find(el => el.props.testID === 'modal-select-item-1');
      button.props.onPress();

      expect(handlePress).toHaveBeenCalledTimes(1);
    });
  });
}
