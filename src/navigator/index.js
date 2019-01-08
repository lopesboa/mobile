// @flow strict

import {createStackNavigator, createAppContainer} from 'react-navigation';

// import Header from '../components/header';
import HomeScreen from '../screens/home';
import {slideNavigator, slideModalsNavigator} from './slide';
import navigationOptions, {navigationOptionsWithoutHeader} from './navigation-options';

const appNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Slide: {screen: slideNavigator}
  },
  {
    defaultNavigationOptions: {
      ...navigationOptions
      // header: Header
    }
  }
);

const appWithModalsNavigator = createStackNavigator(
  {
    App: {screen: appNavigator},
    Correction: {screen: slideModalsNavigator}
  },
  {
    defaultNavigationOptions: navigationOptionsWithoutHeader,
    headerMode: 'none',
    mode: 'modal'
  }
);

export default createAppContainer(appWithModalsNavigator);
