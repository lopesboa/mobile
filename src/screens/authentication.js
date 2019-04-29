// @flow

import * as React from 'react';
import {Linking, StatusBar, StyleSheet, InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import splashScreen from 'react-native-splash-screen';

import {assistanceEmail} from '../../app';
import {BLUE_COORP_DARK} from '../modules/theme';
import Authentication, {TOP_COLOR} from '../components/authentication';
import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import localToken from '../utils/local-token';
import type {Params as QRCodeScreenParams} from './qr-code';

type ConnectedStateToProps = {|
  isAuthenticated: boolean
|};

type ConnectedDispatchProps = {|
  signIn: typeof signIn
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

class AuthenticationScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isSplashScreenHidden: false
  };

  async componentDidMount() {
    const token = await localToken.get();

    if (token) {
      await this.handleSignIn(token);
    }

    return this.hideSplashScreen();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
      this.props.navigation.popToTop();
    }
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
  signIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationScreen);
