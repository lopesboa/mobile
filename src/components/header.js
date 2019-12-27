// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {getStatusBarHeight} from '../modules/status-bar';

import HeaderSlideTitle from '../containers/header-slide-title';
import HeaderSlideRight from '../containers/header-slide-right';
import theme from '../modules/theme';
import withDarkMode from '../containers/with-dark-mode';
import type {WithDarkModeProps} from '../containers/with-dark-mode';
import HeaderBackIcon from './header-back-icon';
import Touchable from './touchable';

type Props = {|
  ...ReactNavigation$WithNavigationProps,
  ...WithDarkModeProps
|};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: getStatusBarHeight(),
    backgroundColor: theme.colors.white
  },
  containerDarkMode: {
    backgroundColor: '#121212'
  },
  headerLeft: {
    flexGrow: 0,
    alignSelf: 'center',
    marginRight: theme.spacing.base
  },
  headerCenter: {
    flexGrow: 2
  },
  headerRight: {
    flexGrow: 0
  },
  headerBackIcon: {
    paddingLeft: theme.spacing.base
  }
});

class Header extends React.Component<Props> {
  props: Props;

  handleBackPress = () => {
    const {navigation} = this.props;
    return navigation.goBack();
  };

  render() {
    const {isDarkModeActivated} = this.props;
    return (
      <View style={[styles.container, isDarkModeActivated && styles.containerDarkMode]}>
        <View style={styles.headerLeft}>
          <Touchable onPress={this.handleBackPress}>
            <HeaderBackIcon style={styles.headerBackIcon} />
          </Touchable>
        </View>
        <View style={styles.headerCenter}>
          <HeaderSlideTitle />
        </View>
        <View style={styles.headerRight}>
          <HeaderSlideRight />
        </View>
      </View>
    );
  }
}

export {Header};
export default withDarkMode(Header);
