// @flow

import * as React from 'react';
import {Linking, StatusBar} from 'react-native';
import {connect} from 'react-redux';

import {assistanceEmail} from '../../app';
import Authentication, {TOP_COLOR} from '../components/authentication';
import Screen from '../components/screen';
import {signIn, signInAnonymous} from '../redux/actions/authentication';
import type {Params as QRCodeScreenParams} from './qr-code';

type ConnectedDispatchProps = {|
  signIn: typeof signIn,
  signInAnonymous: typeof signInAnonymous
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps
|};

class AuthenticationScreen extends React.PureComponent<Props> {
  props: Props;

  handleScan = (token?: string) => {
    this.props.signIn(token);
    this.props.navigation.navigate('Home');
  };

  handlePress = () => {
    const {navigation} = this.props;
    const params: QRCodeScreenParams = {
      onScan: this.handleScan
    };
    navigation.navigate('QRCodeModal', params);
  };

  handleStartDemoPress = () => {
    this.signInAnonymous();
  };

  signInAnonymous = async () => {
    await this.props.signInAnonymous();
    this.props.navigation.navigate('Home');
  };

  handleAssistancePress = () => {
    Linking.openURL(`mailto:${assistanceEmail}`);
  };

  render() {
    return (
      <Screen testID="authentication-screen" noScroll noSafeArea>
        <StatusBar barStyle="light-content" backgroundColor={TOP_COLOR} />
        <Authentication
          onStartDemoPress={this.handleStartDemoPress}
          onPress={this.handlePress}
          onAssistancePress={this.handleAssistancePress}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  signInAnonymous
};

export default connect(
  null,
  mapDispatchToProps
)(AuthenticationScreen);
