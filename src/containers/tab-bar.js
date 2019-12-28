// @flow strict

import * as React from 'react';
import {BottomTabBar} from 'react-navigation';
import {StyleSheet} from 'react-native';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';

import {BrandThemeContext} from '../components/brand-theme-provider';
import theme from '../modules/theme';
import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';
import withDarkMode from './with-dark-mode';
import type {WithDarkModeProps} from './with-dark-mode';

type Props = {|
  ...WithVibrationProps,
  ...$Exact<_BottomTabBarProps>,
  ...WithDarkModeProps
|};

const styles = StyleSheet.create({
  containerDarkMode: {
    backgroundColor: theme.colors.black.lightMedium
  }
});

class TabBar extends React.Component<Props> {
  props: Props;

  handleTabPress = (scene: TabScene) => {
    const {onTabPress, vibration} = this.props;

    vibration.vibrate();

    return onTabPress(scene);
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      vibration,
      /* eslint-enable no-unused-vars */
      isDarkModeActivated,
      ...props
    } = this.props;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <BottomTabBar
            {...props}
            style={[props.style, isDarkModeActivated && styles.containerDarkMode]}
            onTabPress={this.handleTabPress}
            inactiveTintColor={
              isDarkModeActivated ? theme.colors.gray.medium : theme.colors.gray.dark
            }
            activeTintColor={isDarkModeActivated ? theme.colors.white : brandTheme.colors.primary}
          />
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export {TabBar as Component};
export default withDarkMode(withVibration(TabBar));
