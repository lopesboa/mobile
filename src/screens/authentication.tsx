import * as React from 'react';
import {Linking, StatusBar, StyleSheet, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import RNBootSplash from 'react-native-bootsplash';
import {withBackHandler} from '../containers/with-backhandler';

import {assistanceEmail} from '../../app';
import {BLUE_COORP_DARK} from '../modules/theme';
import {AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import Authentication, {TOP_COLOR} from '../components/authentication';
import Screen from '../components/screen';
import {signIn} from '../redux/actions/authentication';
import {selectCard} from '../redux/actions/catalog/cards/select';
import NotificationHandler from '../notification-handler';
import {ChapterCard, DisciplineCard} from '../layer/data/_types';

import {get as getToken} from '../utils/local-token';
import {getToken as _getToken} from '../redux/utils/state-extract';
import {migrationsRunner} from '../migrations';
import ErrorListener from '../containers/error-listener';
import type {Params as AuthenticationDetailsParams} from './authentication-details';

export interface ConnectedStateProps {
  isAuthenticated: boolean;
}

interface ConnectedDispatchProps {
  signIn: typeof signIn;
  selectCard: typeof selectCard;
}

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

type State = {
  isSplashScreenHidden: boolean;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLUE_COORP_DARK,
  },
});

class AuthenticationScreen extends React.PureComponent<Props, State> {
  static handleBackButton = (): boolean => {
    BackHandler.exitApp();
    return true;
  };

  constructor(props) {
    super(props);
    // @ts-ignore
    this.notif = new NotificationHandler(this.handleNotification.bind(this));
    this.state = {
      isSplashScreenHidden: false,
    };
  }

  async componentDidMount() {
    const token = await getToken();

    if (token) {
      await this.handleSignIn(AUTHENTICATION_TYPE.RECONNECTION, token);
    }
    await this.runMigrations();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
      this.handleSignOut();
    }
  }

  hideSplashScreen = () => {
    // Because iOS automatically hides the splash screen
    this.setState({
      isSplashScreenHidden: true,
    });

    RNBootSplash.hide({duration: 250});
  };

  handleSignOut = () => this.props.navigation.popToTop();

  handleSignIn = async (authenticationType: AuthenticationType, token?: string) => {
    this.props.navigation.navigate('Home');
    await this.props.signIn(authenticationType, token);
  };

  handleNotification(content: DisciplineCard | ChapterCard) {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(content);
  }

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

  runMigrations = async () => {
    try {
      await migrationsRunner();
      return this.hideSplashScreen();
    } catch (error) {
      return this.hideSplashScreen();
    }
  };

  handleDetailsNavigation = (type: Pick<AuthenticationDetailsParams, 'type'>) => {
    const {navigation} = this.props;
    const params: AuthenticationDetailsParams = {
      type,
      onHelpPress: this.handleHelpPress,
      onDemoPress: this.handleDemoPress,
      onSignIn: this.handleSignIn,
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
        {isSplashScreenHidden ? (
          <Authentication
            onDemoPress={this.handleDemoPress}
            onHelpPress={this.handleHelpPress}
            onDesktopButtonPress={this.handleDesktopButtonPress}
            onMobileButtonPress={this.handleMobileButtonPress}
            testID="authentication"
          />
        ) : null}
        <ErrorListener onClose={this.handleSignOut} />
      </Screen>
    );
  }
}

const getIsAuthenticatedState: (state: StoreState) => boolean = createSelector(
  [_getToken],
  (token) => Boolean(token),
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isAuthenticated: getIsAuthenticatedState(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  selectCard,
};

export {AuthenticationScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withBackHandler(AuthenticationScreen, AuthenticationScreen.handleBackButton));
