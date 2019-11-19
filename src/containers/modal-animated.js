// @flow

import * as React from 'react';
import Modal from 'react-native-modal';

export type Props = {|
  isVisible?: boolean,
  children: React.Node,
  onClose: () => void,
  testID?: string
|};

const ModalAnimated = ({isVisible, children, onClose, testID}: Props) => (
  <Modal
    isVisible={Boolean(isVisible)}
    onSwipeComplete={onClose}
    onBackdropPress={onClose}
    testID={testID}
  >
    {children}
  </Modal>
);

export default ModalAnimated;
