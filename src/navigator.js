// @flow strict

import {createBottomTabNavigator, createAppContainer, TabBarBottom} from 'react-navigation';
import type {NavigationRouteConfigMap, NavigationScreenConfig} from 'react-navigation';

import theme from './modules/theme';
import SlideScreen from './screens/slide';

const tabs: NavigationRouteConfigMap = {
  SlideScreen
};

const navigationOptions: NavigationScreenConfig<*> = {
  headerBackTitle: null,
  headerTintColor: theme.colors.black,
  headerTitleStyle: {
    width: 250
  },
  headerStyle: {
    backgroundColor: theme.colors.gray.extra,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0
  }
};

const tabNavigator = createBottomTabNavigator(tabs, {
  defaultNavigationOptions: navigationOptions,
  tabBarOptions: {
    style: {
      // @todo: will be removed when we'll need tabs to be displayed
      height: 0,
      borderTopColor: 'transparent',
      backgroundColor: 'transparent'
    }
  },
  tabBarComponent: TabBarBottom
});

export default createAppContainer(tabNavigator);
