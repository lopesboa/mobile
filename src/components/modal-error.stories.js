// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import {handleFakePress} from '../utils/tests';
import {ERROR_TYPE} from '../const';
import ModalError from './modal-error';

storiesOf('ModalError', module)
  .add('No content found', () => (
    <ModalError
      type={ERROR_TYPE.NO_CONTENT_FOUND}
      onPress={handleFakePress}
      onAssistancePress={handleFakePress}
      onClose={handleFakePress}
    />
  ))
  .add('Platform not activated', () => (
    <ModalError
      type={ERROR_TYPE.PLATFORM_NOT_ACTIVATED}
      onPress={handleFakePress}
      onClose={handleFakePress}
      onAssistancePress={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('ModalError', () => {
    it('should handle close', () => {
      const handleClose = jest.fn();
      const component = renderer.create(
        <ModalError
          type={ERROR_TYPE.NO_CONTENT_FOUND}
          onPress={handleFakePress}
          onAssistancePress={handleFakePress}
          onClose={handleClose}
        />
      );

      const button = component.root.find(el => el.props.testID === 'close-modal');
      button.props.onPress();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should handle press', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <ModalError
          type={ERROR_TYPE.NO_CONTENT_FOUND}
          onPress={handlePress}
          onAssistancePress={handleFakePress}
          onClose={handleFakePress}
        />
      );

      const button = component.root.find(el => el.props.testID === 'button-retry-action');
      button.props.onPress();
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should handle assistance press', () => {
      const handleAssistancePress = jest.fn();
      const component = renderer.create(
        <ModalError
          type={ERROR_TYPE.NO_CONTENT_FOUND}
          onPress={handleFakePress}
          onAssistancePress={handleAssistancePress}
          onClose={handleFakePress}
        />
      );

      const touchable = component.root.find(el => el.props.testID === 'ask-for-help');
      touchable.props.onPress();
      expect(handleAssistancePress).toHaveBeenCalledTimes(1);
    });
  });
}
