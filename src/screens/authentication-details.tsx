import * as React from 'react';
import {StatusBar} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {withBackHandler} from '../containers/with-backhandler';

import {openInbox} from '../modules/inbox';
import {AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import AuthenticationDetails, {TOP_COLOR} from '../components/authentication-details';
import type {Props as AuthenticationDetailsProps} from '../components/authentication-details';
import Screen from '../components/screen';
import type {Params as QRCodeScreenParams} from './qr-code';

export type Params = {
  type: Pick<AuthenticationDetailsProps, 'type'>;
  onSignIn: (type: AuthenticationType, token?: string) => Promise<void>;
  onHelpPress: Pick<AuthenticationDetailsProps, 'onHelpPress'>;
  onDemoPress: Pick<AuthenticationDetailsProps, 'onDemoPress'>;
};

type ParamList = {
  AuthenticationDetails: Params;
  Modals: {screen: string; params: QRCodeScreenParams};
};

type Props = StackScreenProps<ParamList, 'AuthenticationDetails'>;

class AuthenticationDetailsScreen extends React.PureComponent<Props> {
  static handleBackButton = (navigation): boolean => {
    navigation.goBack();
    return true;
  };

  handleScan = (token?: string) => {
    const {route} = this.props;
    route.params?.onSignIn(AUTHENTICATION_TYPE.QR_CODE, token);
  };

  handleButtonPress = () => {
    const {type} = this.props.route.params;

    if (type === AUTHENTICATION_TYPE.QR_CODE) {
      const {navigation} = this.props;
      const params: QRCodeScreenParams = {
        onScan: this.handleScan,
      };
      navigation.navigate('Modals', {screen: 'QRCode', params});
    }

    if (type === AUTHENTICATION_TYPE.MAGIC_LINK) {
      openInbox();
    }
  };

  handleOnBack = () => AuthenticationDetailsScreen.handleBackButton(this.props.navigation);

  render() {
    const {type, onHelpPress, onDemoPress} = this.props.route?.params;

    return (
      <Screen testID="authentication-details-screen" noScroll noSafeArea>
        <StatusBar barStyle="light-content" backgroundColor={TOP_COLOR} />
        <AuthenticationDetails
          type={type}
          onHelpPress={onHelpPress}
          onDemoPress={onDemoPress}
          onButtonPress={this.handleButtonPress}
          onBack={this.handleOnBack}
        />
      </Screen>
    );
  }
}
export {AuthenticationDetailsScreen as Component};
export default withBackHandler(
  AuthenticationDetailsScreen,
  AuthenticationDetailsScreen.handleBackButton,
);
