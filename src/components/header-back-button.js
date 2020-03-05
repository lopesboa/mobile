// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaSolidPlacesPlacesHome2 as HomeIcon,
  NovaSolidStatusClose as CloseIcon
} from '@coorpacademy/nova-icons';

import theme, {getHitSlop} from '../modules/theme';
import {getStatusBarHeight} from '../modules/status-bar';
import HeaderBackIcon from './header-back-icon';
import Touchable from './touchable';

export const HOME_ICON_HEIGHT = 20;
export const CLOSE_ICON_HEIGHT = 16;
export const BACK_ICON_HEIGHT = 20;
export const SPACING = theme.spacing.base;

type Props = {|
  type: 'close' | 'back' | 'home',
  color?: string,
  onPress: () => void,
  isFloating?: boolean,
  noSafeArea?: boolean,
  testID: string
|};

const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACING
  },
  floating: {
    paddingTop: SPACING,
    position: 'absolute',
    top: getStatusBarHeight()
  },
  noSafeArea: {
    top: 0
  }
});

const HeaderBackButton = ({
  type,
  color = theme.colors.white,
  onPress,
  isFloating = true,
  noSafeArea = false,
  testID
}: Props) => (
  <View
    style={[
      styles.container,
      isFloating && styles.floating,
      isFloating && noSafeArea && styles.noSafeArea
    ]}
  >
    <Touchable testID={testID} onPress={onPress} hitSlop={getHitSlop()} analyticsID="button-close">
      {type === 'home' ? (
        <HomeIcon height={HOME_ICON_HEIGHT} width={HOME_ICON_HEIGHT} color={color} />
      ) : null}
      {type === 'close' ? (
        <CloseIcon height={CLOSE_ICON_HEIGHT} width={CLOSE_ICON_HEIGHT} color={color} />
      ) : null}
      {type === 'back' ? (
        <HeaderBackIcon height={BACK_ICON_HEIGHT} width={BACK_ICON_HEIGHT} color={color} />
      ) : null}
    </Touchable>
  </View>
);

export default HeaderBackButton;
