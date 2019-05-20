// @flow

import * as React from 'react';
import {StatusBar, Linking} from 'react-native';
import {NavigationActions} from 'react-navigation';

import {AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import AuthenticationDetails, {TOP_COLOR} from '../components/authentication-details';
import type {Props as AuthenticationDetailsProps} from '../components/authentication-details';
import Screen from '../components/screen';
import type {Params as QRCodeScreenParams} from './qr-code';

export type Params = {|
  type: $PropertyType<AuthenticationDetailsProps, 'type'>,
  onSignIn: (AuthenticationType, string) => Promise<void>,
  onHelpPress: $PropertyType<AuthenticationDetailsProps, 'onHelpPress'>,
  onDemoPress: $PropertyType<AuthenticationDetailsProps, 'onDemoPress'>
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

class AuthenticationDetailsScreen extends React.PureComponent<Props> {
  props: Props;

  handleScan = (token?: string) => {
    const {navigation} = this.props;
    navigation.state.params.onSignIn(AUTHENTICATION_TYPE.QR_CODE, token);
  };

  handleButtonPress = () => {
    const {type} = this.props.navigation.state.params;

    if (type === AUTHENTICATION_TYPE.QR_CODE) {
      const {navigation} = this.props;
      const params: QRCodeScreenParams = {
        onScan: this.handleScan
      };
      navigation.navigate('QRCodeModal', params);
    }

    if (type === AUTHENTICATION_TYPE.MAGIC_LINK) {
      Linking.openURL(`https://`);
    }
  };

  handleBack = () => this.props.navigation.dispatch(NavigationActions.back());

  render() {
    const {type, onHelpPress, onDemoPress} = this.props.navigation.state.params;

    return (
      <Screen testID="authentication-details-screen" noScroll noSafeArea>
        <StatusBar barStyle="light-content" backgroundColor={TOP_COLOR} />
        <AuthenticationDetails
          type={type}
          onHelpPress={onHelpPress}
          onDemoPress={onDemoPress}
          onButtonPress={this.handleButtonPress}
          onBack={this.handleBack}
        />
      </Screen>
    );
  }
}

export default AuthenticationDetailsScreen;
