import * as React from 'react';
import {StyleSheet} from 'react-native';

import theme from '../modules/theme';
import HeaderLeft from '../containers/header-left';
import HeaderBackIcon from '../components/header-back-icon';
import {BACKGROUND_COLOR as SCREEN_BACKGROUND_COLOR} from '../components/screen';

export const HEADER_BACKGROUND_COLOR = theme.colors.gray.extra;
export const SETTINGS_SCREEN_HEADER_BACKGROUND_COLOR = theme.colors.white;
export const HEADER_HEIGHT = 60;
export const INITIAL_APP_ROUTE_NAME = 'App';
export const INITIAL_ROUTE_NAME = 'Authentication';

const styles = StyleSheet.create({
  back: {
    paddingLeft: theme.spacing.base,
  },
});

const navigationOptions: NavigationScreenConfig<any> = {
  headerBackTitle: null,
  headerTintColor: theme.colors.black,
  headerTitleStyle: {
    flex: 1,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.regular,
    color: theme.colors.negative,
  },
  headerStyle: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    height: HEADER_HEIGHT,
  },
  headerLeft: HeaderLeft,
  headerBackImage: () => <HeaderBackIcon style={styles.back} />,
};

export const navigationOptionsWithoutHeader: NavigationScreenConfig<any> = {
  headerTintColor: theme.colors.black,
  headerTitleStyle: {
    flex: 1,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.regular,
    color: theme.colors.negative,
  },
  gestureEnabled: false,
  headerStyle: {
    ...navigationOptions.headerStyle,
    height: 0,
  },
  headerShown: false,
};

export default navigationOptions;
