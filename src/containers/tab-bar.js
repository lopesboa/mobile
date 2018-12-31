// @flow

import * as React from 'react';
import {BottomTabBar} from 'react-navigation';
import type {_BottomTabBarProps} from 'react-navigation';

import {BrandThemeContext} from '../components/brand-theme-provider';

type Props = _BottomTabBarProps;

const TabBar = (props: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => <BottomTabBar {...props} activeTintColor={brandTheme.colors.primary} />}
  </BrandThemeContext.Consumer>
);

export default TabBar;
