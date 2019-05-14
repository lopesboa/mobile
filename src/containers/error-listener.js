// @flow
import React from 'react';

import Modal from 'react-native-modal';
import {Linking} from 'react-native';
import {connect} from 'react-redux';
import ErrorModalComponent from '../components/error-modal';
import type {ErrorType} from '../types';
import {ERROR_TYPE} from '../const';
import {hideModal, refresh} from '../redux/actions/ui/modal';
import {signOut} from '../redux/actions/authentication';

import {assistanceEmail} from '../../app';

type ConnectedStateToProps = {|
  isVisible: boolean,
  errorType: ErrorType,
  lastAction?: () => void
|};

type ConnectedDispatchProps = {|
  hideModal: typeof hideModal,
  refresh: typeof refresh,
  signOut: typeof signOut
|};

export type Props = {|
  ...ConnectedStateToProps,
  ...ConnectedDispatchProps
|};

type State = {
  isVisible: boolean
};
class ErrorModal extends React.PureComponent<Props, State> {
  props: Props;

  handleAssistancePress = () => {
    Linking.openURL(`mailto:${assistanceEmail}`);
  };

  handleClose = () => {
    if (this.props.errorType === ERROR_TYPE.NO_CONTENT_FOUND) {
      this.props.signOut();
    }
    this.props.hideModal();
  };

  handlePress = () => {
    if (this.props.errorType === ERROR_TYPE.PLATFORM_NOT_ACTIVATED) {
      this.handleAssistancePress();
    } else {
      this.props.refresh();
    }
  };

  render() {
    const {errorType} = this.props;

    return (
      <Modal
        isVisible={this.props.isVisible}
        onSwipeComplete={this.handleClose}
        onBackdropPress={this.handleClose}
      >
        <ErrorModalComponent
          onClose={this.handleClose}
          onPress={this.handlePress}
          onAssistancePress={this.handleAssistancePress}
          type={errorType}
        />
      </Modal>
    );
  }
}

const mapStateToProps = ({error}: StoreState): ConnectedStateToProps => ({
  isVisible: error.isVisible,
  errorType: error.errorType,
  lastAction: error.lastAction
});

const mapDispatchToProps: ConnectedDispatchProps = {
  hideModal,
  refresh,
  signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);
