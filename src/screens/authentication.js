// @flow

import * as React from 'react';
import {Linking, StatusBar, StyleSheet, InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import splashScreen from 'react-native-splash-screen';

import {assistanceEmail} from '../../app';
import {BLUE_COORP_DARK} from '../modules/theme';
import {AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import Authentication, {TOP_COLOR} from '../components/authentication';
import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import {get as getToken} from '../utils/local-token';
import {getToken as getTokenState} from '../redux/utils/state-extract';
import ErrorListener from '../containers/error-listener';
import type {Params as AuthenticationDetailsParams} from './authentication-details';

export type ConnectedStateProps = {|
  isAuthenticated: boolean
|};

type ConnectedDispatchProps = {|
  signIn: typeof signIn
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
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
    const token = await getToken();

    if (token) {
      await this.handleSignIn(AUTHENTICATION_TYPE.RECONNECTION, token);
    }

    return this.hideSplashScreen();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
      this.handleSignOut();
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

  handleSignOut = () => this.props.navigation.popToTop();

  handleSignIn = async (authenticationType: AuthenticationType, token?: string) => {
    await this.props.navigation.navigate('Home');
    await this.props.signIn(authenticationType, token);
  };

  handleDemoPress = () => {
    this.handleSignIn(AUTHENTICATION_TYPE.DEMO);
  };

  handleHelpPress = () => {
    Linking.openURL(`mailto:${assistanceEmail}`);
  };

  handleDesktopButtonPress = () => {
    this.handleDetailsNavigation(AUTHENTICATION_TYPE.QR_CODE);
  };

  handleMobileButtonPress = () => {
    this.handleDetailsNavigation(AUTHENTICATION_TYPE.MAGIC_LINK);
  };

  handleDetailsNavigation = (type: $PropertyType<AuthenticationDetailsParams, 'type'>) => {
    const {navigation} = this.props;
    const params: AuthenticationDetailsParams = {
      type,
      onHelpPress: this.handleHelpPress,
      onDemoPress: this.handleDemoPress,
      onSignIn: this.handleSignIn
    };
    navigation.navigate('AuthenticationDetails', params);
  };

  render() {
    const {isSplashScreenHidden} = this.state;

    return (
      <Screen testID="authentication-screen" noScroll noSafeArea style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={isSplashScreenHidden ? TOP_COLOR : BLUE_COORP_DARK}
        />
        {isSplashScreenHidden && (
          <Authentication
            onDemoPress={this.handleDemoPress}
            onHelpPress={this.handleHelpPress}
            onDesktopButtonPress={this.handleDesktopButtonPress}
            onMobileButtonPress={this.handleMobileButtonPress}
          />
        )}
        <ErrorListener onClose={this.handleSignOut} />
      </Screen>
    );
  }
}

const getIsAuthenticatedState: StoreState => boolean = createSelector(
  [getTokenState],
  token => Boolean(token)
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isAuthenticated: getIsAuthenticatedState(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthenticationScreen);
