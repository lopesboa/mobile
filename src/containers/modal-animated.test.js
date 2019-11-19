// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import Text from '../components/text';
import ModalAnimated from './modal-animated';

describe('ModalAnimated', () => {
  it('should handle close on swipe complete', () => {
    const handleClose = jest.fn();

    const component = renderer.create(
      <ModalAnimated onClose={handleClose} testID="modal-animated">
        <Text>Foo bar</Text>
      </ModalAnimated>
    );

    const modal = component.root.find(
      el => el.props.testID === 'modal-animated' && el.props.onSwipeComplete
    );
    modal.props.onSwipeComplete();

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should handle close on backdrop press', () => {
    const handleClose = jest.fn();

    const component = renderer.create(
      <ModalAnimated onClose={handleClose} testID="modal-animated">
        <Text>Foo bar</Text>
      </ModalAnimated>
    );

    const modal = component.root.find(
      el => el.props.testID === 'modal-animated' && el.props.onBackdropPress
    );
    modal.props.onBackdropPress();

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
