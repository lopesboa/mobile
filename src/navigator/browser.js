// @flow
import {createStackNavigator} from 'react-navigation';

import theme from '../modules/theme';
import BrowserScreen from '../screens/browser';
import navigationOptions from './navigation-options';

const browserNavigator = createStackNavigator(
  {
    BrowserModal: {screen: BrowserScreen}
  },
  {
    defaultNavigationOptions: {
      ...navigationOptions,
      headerTitleStyle: {
        ...navigationOptions.headerTitleStyle,
        color: theme.colors.gray.dark
      }
    },
    mode: 'modal'
  }
);

export default browserNavigator;
