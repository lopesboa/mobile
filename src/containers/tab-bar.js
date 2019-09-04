// @flow strict

import * as React from 'react';
import {BottomTabBar} from 'react-navigation';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';

import {BrandThemeContext} from '../components/brand-theme-provider';
import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';

type Props = {|
  ...WithVibrationProps,
  ...$Exact<_BottomTabBarProps>
|};

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
      ...props
    } = this.props;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <BottomTabBar
            {...props}
            onTabPress={this.handleTabPress}
            activeTintColor={brandTheme.colors.primary}
          />
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export {TabBar as Component};
export default withVibration(TabBar);
