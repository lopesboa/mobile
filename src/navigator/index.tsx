import * as React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {changeScreen} from '../redux/actions/navigation';
import {navigationRef} from './helper';
import {
  navigationOptionsWithoutHeader,
  INITIAL_APP_ROUTE_NAME,
  INITIAL_ROUTE_NAME,
} from './navigation-options';
import ModalsNavigator from './modals';
import AppNavigator from './app';

const Stack = createStackNavigator();

function Navigator(props: {onStateChange: () => NavigationState}) {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onStateChange={props.onStateChange}>
        <Stack.Navigator
          initialRouteName={INITIAL_APP_ROUTE_NAME}
          headerMode="none"
          screenOptions={navigationOptionsWithoutHeader}
          mode="modal"
        >
          <Stack.Screen name="App" component={AppNavigator} />
          <Stack.Screen name="Modals" component={ModalsNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

interface ConnectedDispatchProps {
  onScreenChange: typeof changeScreen;
}

type Props = ConnectedDispatchProps;

type ExtractScreensResult = {
  currentNavigatorName: string;
  currentAppScreenName?: string;
  currentScreenName?: string;
  currentTabName?: string;
};

const getCurrentNavigatorName = (state: NavigationState): string => {
  const stackNavigator = state.routes[state.index];
  const currentRoute = stackNavigator.state?.routes[stackNavigator?.state?.index ?? 0];
  const navigatorName =
    currentRoute?.state?.type === 'stack' ? currentRoute.name : stackNavigator.name;
  return navigatorName;
};

const getCurrentScreenName = (state: NavigationState): string | undefined => {
  const stackNavigator = state.routes[state.index];
  const currentRoute = stackNavigator.state?.routes[stackNavigator?.state?.index ?? 0];
  return currentRoute?.name;
};

const getCurrentTabName = (state: NavigationState): string | undefined => {
  const stackNavigator = state.routes[state.index];
  const currentRoute = stackNavigator.state?.routes[stackNavigator?.state?.index ?? 0];
  if (currentRoute?.name === 'Slide') {
    const _route = currentRoute.state?.routes[currentRoute?.state?.index ?? 0];
    return _route?.state?.index ? _route?.state?.routes[_route?.state?.index].name : undefined;
  }
  return undefined;
};

const extractScreens = (state): ExtractScreensResult => {
  const currentNavigatorName = getCurrentNavigatorName(state);
  const currentScreenName = getCurrentScreenName(state);
  const currentTabName = getCurrentTabName(state);
  const currentAppScreenName = currentScreenName;

  return {
    currentNavigatorName,
    currentAppScreenName,
    currentScreenName,
    currentTabName,
  };
};

function NavigatorWithState({onScreenChange}: Props) {
  React.useEffect(() => {
    onScreenChange(INITIAL_APP_ROUTE_NAME, INITIAL_ROUTE_NAME, INITIAL_ROUTE_NAME);
  }, []);

  function handleNavigationStateChange(currentState: NavigationState) {
    if (!currentState) {
      return null;
    }

    const currentScreens = extractScreens(currentState);

    const {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName,
    } = currentScreens;

    if (!currentAppScreenName || !currentScreenName) {
      return null;
    }

    onScreenChange(currentNavigatorName, currentAppScreenName, currentScreenName, currentTabName);
  }
  // @ts-ignore Bad react-navigation definition with interfaces
  return <Navigator onStateChange={handleNavigationStateChange} />;
}

const mapDispatchToProps: ConnectedDispatchProps = {
  onScreenChange: changeScreen,
};

export default connect(null, mapDispatchToProps)(NavigatorWithState);
