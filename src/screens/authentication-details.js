// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {BackHandler} from '../modules/back-handler';

import {openInbox} from '../modules/inbox';
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

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.handleBack();
    return true;
  };

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
      openInbox();
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
