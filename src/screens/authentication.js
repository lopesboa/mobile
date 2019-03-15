// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import Authentication from '../components/authentication';
import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import type {Params as QRCodeScreenParams} from './qr-code';

type ConnectedDispatchProps = {|
  signIn: typeof signIn
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

  render() {
    return (
      <Screen testID="authentication-screen" noScroll noSafeArea>
        <Authentication onPress={this.handlePress} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(null, mapDispatchToProps)(AuthenticationScreen);
