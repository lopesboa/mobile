// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import {NovaSolidSpaceRingPlanet as RingPlanet} from '@coorpacademy/nova-icons';

import {__TEST__} from '../modules/environment';
import {handleFakePress} from '../utils/tests';
import Modal from './modal';
import Text from './text';

const renderIcon = () => <RingPlanet color="#f00" height={60} width={60} />;

storiesOf('Modal', module)
  .add('Default', () => (
    <Modal onClose={handleFakePress}>
      <Text>Some content</Text>
    </Modal>
  ))
  .add('Custom header and icon background color', () => (
    <Modal
      renderIcon={renderIcon}
      headerBackgroundColor="rgba(0, 128, 0, 0.2)"
      iconBackgroundColor="rgba(0, 128, 0, 0.2)"
      onClose={handleFakePress}
    >
      <Text>Modal with header and icon</Text>
    </Modal>
  ));

if (__TEST__) {
  describe('Modal', () => {
    it('should handle close', () => {
      const handleClose = jest.fn();
      const component = renderer.create(
        <Modal onClose={handleClose}>
          <Text>Some content</Text>
        </Modal>
      );

      const button = component.root.find(el => el.props.testID === 'close-modal');
      button.props.onPress();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
}
