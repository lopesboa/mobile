// @flow
import {createStackNavigator} from 'react-navigation';

import theme from '../modules/theme';
import PdfScreen from '../screens/pdf';
import navigationOptions from './navigation-options';

const pdfNavigator = createStackNavigator(
  {
    PdfModal: {screen: PdfScreen}
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

export default pdfNavigator;
