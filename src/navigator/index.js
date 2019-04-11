// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createStackNavigator, createAppContainer, NavigationActions} from 'react-navigation';
import type {NavigationAction, NavigationState} from 'react-navigation';
import {NovaCompositionNavigationArrowLeft} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import HeaderSlideTitle from '../containers/header-slide-title';
import HeaderSlideRight from '../containers/header-slide-right';
import HomeScreen from '../screens/home';
import AuthenticationScreen from '../screens/authentication';
import SplashScreen from '../screens/splash';
import QRCodeScreen from '../screens/qr-code';
import {changeScreen} from '../redux/actions/navigation';
import {slideNavigator, slideModalsNavigator} from './slide';
import pdfNavigator from './pdf';
import browserNavigator from './browser';
import navigationOptions, {
  navigationOptionsWithoutHeader,
  HEADER_BACKGROUND_COLOR,
  INITIAL_ROUTE_NAME
} from './navigation-options';

const appNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        ...navigationOptionsWithoutHeader,
        gesturesEnabled: false
      }
    },
    Authentication: {
      screen: AuthenticationScreen,
      navigationOptions: {
        ...navigationOptionsWithoutHeader,
        gesturesEnabled: false
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        ...navigationOptionsWithoutHeader,
        gesturesEnabled: false
      }
    },
    Slide: {
      screen: slideNavigator,
      navigationOptions: {
        ...navigationOptions,
        headerStyle: {
          ...navigationOptions.headerStyle,
          backgroundColor: HEADER_BACKGROUND_COLOR
        },
        headerTitle: HeaderSlideTitle,
        headerRight: <HeaderSlideRight />,
        gesturesEnabled: true
      }
    }
  },
  {
    initialRouteName: INITIAL_ROUTE_NAME,
    defaultNavigationOptions: {
      ...navigationOptions,
      headerBackImage: (
        <NovaCompositionNavigationArrowLeft height={16} width={16} color={theme.colors.gray.dark} />
      ),
      gesturesEnabled: true
    }
  }
);

const defaultGetStateForAction = appNavigator.router.getStateForAction;

appNavigator.router.getStateForAction = (action: NavigationAction, state: ?NavigationState) => {
  const disabledScreens = ['Splash', 'Authentication', 'Home'];

  if (
    state &&
    action.type === NavigationActions.BACK &&
    disabledScreens.includes(state.routes[state.index].routeName)
  ) {
    // Block back action on Home and Authentication
    return null;
  }

  return defaultGetStateForAction(action, state);
};

const navigator = createStackNavigator(
  {
    App: {screen: appNavigator},
    SlideModal: {screen: slideModalsNavigator},
    PdfModal: {screen: pdfNavigator},
    BrowserModal: {screen: browserNavigator},
    QRCodeModal: {screen: QRCodeScreen}
  },
  {
    defaultNavigationOptions: navigationOptionsWithoutHeader,
    headerMode: 'none',
    mode: 'modal'
  }
);

const Navigator = createAppContainer(navigator);

type ConnectedDispatchProps = {|
  onScreenChange: typeof changeScreen
|};

type Props = {|
  ...ConnectedDispatchProps
|};

type ExtractScreensResult = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
|};

const extractScreens = (state: NavigationState): ExtractScreensResult => {
  const rootNavigator = state.routes[state.index];
  const stackNavigator = state.routes[0];
  const appScreen = stackNavigator.routes ? stackNavigator.routes[stackNavigator.index] : null;
  const screen = rootNavigator.routes ? rootNavigator.routes[rootNavigator.index] : null;
  const tabs = screen && screen.routes ? screen.routes[screen.index] : null;
  const tab = tabs && tabs.routes ? tabs.routes[tabs.index] : null;

  const currentNavigatorName = rootNavigator.routeName;
  const currentAppScreenName = (appScreen && appScreen.routeName) || undefined;
  const currentScreenName = (screen && screen.routeName) || undefined;
  const currentTabName = (tab && tab.routeName) || undefined;

  return {currentNavigatorName, currentAppScreenName, currentScreenName, currentTabName};
};

class NavigatorWithState extends React.PureComponent<Props> {
  props: Props;

  handleNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const {onScreenChange} = this.props;

    if (!currentState) {
      return null;
    }

    const prevScreens = extractScreens(prevState);
    const currentScreens = extractScreens(currentState);

    // To prevent same navigation dispatch
    if (JSON.stringify(prevScreens) === JSON.stringify(currentScreens)) {
      return null;
    }

    const {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName
    } = currentScreens;

    if (!currentAppScreenName || !currentScreenName) {
      return null;
    }

    onScreenChange(currentNavigatorName, currentAppScreenName, currentScreenName, currentTabName);
  };

  render() {
    return <Navigator onNavigationStateChange={this.handleNavigationStateChange} />;
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  onScreenChange: changeScreen
};

export default connect(
  null,
  mapDispatchToProps
)(NavigatorWithState);
