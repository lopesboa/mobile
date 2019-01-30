// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {BottomTabBar} from 'react-navigation';
import type {_BottomTabBarProps} from 'react-navigation';

import {BrandThemeContext} from '../components/brand-theme-provider';
import type {StoreState} from '../redux';

type ConnectedStateToProps = {|
  isHidden: boolean
|};

type Props = {|
  ...ConnectedStateToProps,
  ...$Exact<_BottomTabBarProps>
|};

const TabBar = ({isHidden, ...props}: Props) => {
  if (isHidden) {
    return null;
  }

  return (
    <BrandThemeContext.Consumer>
      {brandTheme => <BottomTabBar {...props} activeTintColor={brandTheme.colors.primary} />}
    </BrandThemeContext.Consumer>
  );
};

const mapStateToProps = ({navigation}: StoreState): ConnectedStateToProps => ({
  isHidden: navigation.isHidden
});

export default connect(mapStateToProps)(TabBar);
