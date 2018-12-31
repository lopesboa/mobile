// @flow strict

import theme from '../modules/theme';
import {BACKGROUND_COLOR as SCREEN_BACKGROUND_COLOR} from '../components/screen';

const navigationOptions: NavigationScreenConfig<*> = {
  headerBackTitle: null,
  headerTintColor: theme.colors.black,
  headerTitleStyle: {
    width: 250
  },
  headerStyle: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    paddingTop: 0
  }
};

export const navigationOptionsWithoutHeader: NavigationScreenConfig<*> = {
  ...navigationOptions,
  headerStyle: {
    ...navigationOptions.headerStyle,
    height: 0,
    borderBottomWidth: 0
  }
};

export default navigationOptions;
