// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {createSelectChoice} from '../__fixtures__/question-choices';
import {__TEST__} from '../modules/environment';
import {handleFakePress} from '../utils/tests';
import ModalSelect from './modal-select';

const select = createSelectChoice({name: 'sel456'});

storiesOf('ModalSelect', module)
  .add('Default', () => (
    <ModalSelect values={select.items || []} onChange={handleFakePress} onClose={handleFakePress} />
  ))
  .add('With value', () => (
    <ModalSelect
      value={select.items && select.items[1] && select.items[1].text}
      values={select.items || []}
      onChange={handleFakePress}
      onClose={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('ModalSelect', () => {
    it('should handle close', () => {
      const handleClose = jest.fn();
      const component = renderer.create(
        <ModalSelect onChange={handleFakePress} onClose={handleClose} values={select.items || []} />
      );

      const button = component.root.find(el => el.props.testID === 'close-modal');
      button.props.onPress();

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should handle change', () => {
      const handleChange = jest.fn();
      const component = renderer.create(
        <ModalSelect
          onChange={handleChange}
          onClose={handleFakePress}
          values={select.items || []}
        />
      );

      const button = component.root.find(el => el.props.testID === 'modal-select-item-2');
      button.props.onPress();

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        select.items && select.items[1] && select.items[1].text
      );
    });
  });
}
