// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import type {NavigationState} from 'react-navigation';

import theme from '../modules/theme';
// import HeaderSlide from '../containers/header-slide';
import HeaderSlideRight from '../containers/header-slide-right';
import HomeScreen from '../screens/home';
import {changeScreen} from '../redux/actions/navigation';
import {slideNavigator, slideModalsNavigator} from './slide';
import navigationOptions, {navigationOptionsWithoutHeader} from './navigation-options';

const appNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Slide: {
      screen: slideNavigator,
      navigationOptions: {
        ...navigationOptions,
        headerStyle: {
          ...navigationOptions.headerStyle,
          backgroundColor: theme.colors.gray.extra
        },
        // headerTitle: <HeaderSlide />,
        headerRight: <HeaderSlideRight />
      }
    }
  },
  {
    defaultNavigationOptions: navigationOptions
  }
);

const navigator = createStackNavigator(
  {
    App: {screen: appNavigator},
    SlideModal: {screen: slideModalsNavigator}
  },
  {
    defaultNavigationOptions: navigationOptionsWithoutHeader,
    headerMode: 'none',
    mode: 'modal'
  }
);

const Navigator = createAppContainer(navigator);

type Props = {|
  onScreenChange: typeof changeScreen
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

    onScreenChange(currentNavigatorName, currentAppScreenName, currentScreenName, currentTabName);
  };

  render() {
    return <Navigator onNavigationStateChange={this.handleNavigationStateChange} />;
  }
}

export default connect(null, {
  onScreenChange: changeScreen
})(NavigatorWithState);
