// @flow

import * as React from 'react';
import {Linking, StatusBar, StyleSheet, InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import splashScreen from 'react-native-splash-screen';

import {assistanceEmail} from '../../app';
import {BLUE_COORP_DARK} from '../modules/theme';
import Authentication, {TOP_COLOR} from '../components/authentication';
import Screen from '../components/screen';
import {signIn, signOut} from '../redux/actions/authentication';
import localToken from '../utils/local-token';
import type {URLEventType} from '../types';
import type {Params as QRCodeScreenParams} from './qr-code';

type ConnectedStateToProps = {|
  isAuthenticated: boolean
|};

type ConnectedDispatchProps = {|
  signIn: typeof signIn,
  signOut: typeof signOut
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateToProps,
  ...ConnectedDispatchProps
|};

type State = {|
  isSplashScreenHidden: boolean
|};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLUE_COORP_DARK
  }
});

const DEEPLINK_PATTERN = /(.+):\/\/authentication\//;

class AuthenticationScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isSplashScreenHidden: false
  };

  async componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);

    const token = await localToken.get();
    if (token) {
      await this.handleSignIn(token);
    }

    const url = await Linking.getInitialURL();

    if (url) {
      await this.handleOpenURL({url});
    }

    return this.hideSplashScreen();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
      this.props.navigation.popToTop();
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  hideSplashScreen = () => {
    // Because iOS automatically hides the splash screen
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isSplashScreenHidden: true
      });
    });

    splashScreen.hide();
  };

  handleOpenURL = async ({url}: URLEventType) => {
    if (url.match(DEEPLINK_PATTERN)) {
      const token = url.replace(DEEPLINK_PATTERN, '');
      if (token) {
        if (this.props.isAuthenticated) {
          await this.props.signOut();
        }
        await this.handleSignIn(token);
      }
    }
  };

  handleSignIn = async (token?: string) => {
    await this.props.signIn(token);
    await this.props.navigation.navigate('Home');
  };

  handleScan = (token?: string) => {
    if (token) {
      this.handleSignIn(token);
    }
  };

  handlePress = () => {
    const {navigation} = this.props;
    const params: QRCodeScreenParams = {
      onScan: this.handleScan
    };
    navigation.navigate('QRCodeModal', params);
  };

  handleStartDemoPress = () => {
    this.handleSignIn();
  };

  handleAssistancePress = () => {
    Linking.openURL(`mailto:${assistanceEmail}`);
  };

  render() {
    const {isSplashScreenHidden} = this.state;

    return (
      <Screen testID="authentication-screen" noScroll noSafeArea style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={TOP_COLOR} />
        {isSplashScreenHidden && (
          <Authentication
            onStartDemoPress={this.handleStartDemoPress}
            onPress={this.handlePress}
            onAssistancePress={this.handleAssistancePress}
          />
        )}
      </Screen>
    );
  }
}

const mapStateToProps = ({authentication}: StoreState): ConnectedStateToProps => ({
  isAuthenticated: Boolean(authentication.token)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationScreen);
