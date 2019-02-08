// @flow

import theme from '../modules/theme';
import {BACKGROUND_COLOR as SCREEN_BACKGROUND_COLOR} from '../components/screen';
import HeaderBackImage from '../components/header-back-image';

export const HEADER_HEIGHT = 60;

const navigationOptions: NavigationScreenConfig<*> = {
  headerBackTitle: null,
  headerTintColor: theme.colors.black,
  headerTitleStyle: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    paddingTop: 0,
    height: HEADER_HEIGHT
  },
  headerBackImage: HeaderBackImage
};

export const navigationOptionsWithoutHeader: NavigationScreenConfig<*> = {
  ...navigationOptions,
  header: null,
  headerBackImage: null,
  headerRight: null,
  headerStyle: {
    ...navigationOptions.headerStyle,
    height: 0,
    borderBottomWidth: 0
  }
};

export default navigationOptions;
