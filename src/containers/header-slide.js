// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {getStatusBarHeight} from '../modules/status-bar';

import theme from '../modules/theme';
import HeaderBackIcon from '../components/header-back-icon';
import Touchable from '../components/touchable';
import HeaderSlideTitle from './header-slide-title';
import HeaderSlideRight from './header-slide-right';
import withDarkMode from './with-dark-mode';
import type {WithDarkModeProps} from './with-dark-mode';

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
    flexGrow: 1
  },
  headerRight: {
    alignSelf: 'center',
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
    const testID = 'header-slide';
    return (
      <View
        style={[styles.container, isDarkModeActivated && styles.containerDarkMode]}
        testID={testID}
      >
        <View style={styles.headerLeft} testID={`${testID}-left`}>
          <Touchable onPress={this.handleBackPress} testID={`${testID}-back-button`}>
            <HeaderBackIcon style={styles.headerBackIcon} />
          </Touchable>
        </View>
        <View style={styles.headerCenter} testID={`${testID}-center`}>
          <HeaderSlideTitle />
        </View>
        <View style={styles.headerRight} testID={`${testID}-right`}>
          <HeaderSlideRight />
        </View>
      </View>
    );
  }
}

export default withDarkMode(Header);
