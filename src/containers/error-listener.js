// @flow

import React from 'react';
import {Linking} from 'react-native';
import {connect} from 'react-redux';

import ModalError from '../components/modal-error';
import type {ErrorType} from '../types';
import {ERROR_TYPE} from '../const';
import {hideError, refresh} from '../redux/actions/ui/errors';
import {signOut} from '../redux/actions/authentication';
import {isErrorVisible, getErrorType} from '../redux/utils/state-extract';
import {assistanceEmail} from '../../app';
import ModalAnimated from './modal-animated';

type ConnectedStateToProps = {|
  ...ReactNavigation$WithNavigationProps,
  isVisible: boolean,
  type: ErrorType
|};

type ConnectedDispatchProps = {|
  hideError: typeof hideError,
  refresh: typeof refresh,
  signOut: typeof signOut
|};

export type Props = {|
  ...ConnectedStateToProps,
  ...ConnectedDispatchProps,
  onClose: () => void
|};

class ErrorListener extends React.PureComponent<Props> {
  props: Props;

  handleAssistancePress = () => {
    Linking.openURL(`mailto:${assistanceEmail}`);
  };

  handleClose = () => {
    this.props.hideError();
    this.props.signOut();
    this.props.onClose();
  };

  handlePress = () => {
    if (this.props.type === ERROR_TYPE.PLATFORM_NOT_ACTIVATED) {
      return this.handleAssistancePress();
    }

    return this.props.refresh();
  };

  render() {
    const {type, isVisible} = this.props;

    return (
      <ModalAnimated isVisible={isVisible} onClose={this.handleClose} testID="modal-animated">
        <ModalError
          onClose={this.handleClose}
          onPress={this.handlePress}
          onAssistancePress={this.handleAssistancePress}
          type={type}
          testID="modal-error"
        />
      </ModalAnimated>
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => ({
  isVisible: isErrorVisible(state),
  type: getErrorType(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  hideError,
  refresh,
  signOut
};

export {ErrorListener as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorListener);
