// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  NovaCompositionCoorpacademyStar as Star,
  NovaCompositionCoorpacademyLock as Lock
} from '@coorpacademy/nova-icons';
import theme from '../modules/theme';
import {TOOLTIP_TYPE} from '../const';
import type {TooltipType} from '../types';
import {useDarkMode} from '../containers/with-dark-mode';
import Html from './html';
import {STYLE as BOX_STYLE} from './box';

const styles = StyleSheet.create({
  container: {
    ...BOX_STYLE,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    borderBottomRightRadius: theme.radius.card,
    flexDirection: 'row',
    padding: theme.spacing.small,
    paddingRight: theme.spacing.medium,
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 1
  },
  containerDarkMode: {
    backgroundColor: theme.colors.black.lightMedium
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerDarkMode: {
    backgroundColor: theme.colors.black.medium
  },
  icon: {
    width: 21,
    height: 21
  },
  text: {
    paddingHorizontal: theme.spacing.base
  },
  textDarkMode: {
    color: theme.colors.white
  },
  corner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 16,
    height: 14,
    borderWidth: 10,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRightColor: theme.colors.white,
    borderBottomColor: theme.colors.white
  },
  cornerDarkMode: {
    borderRightColor: theme.colors.black.lightMedium,
    borderBottomColor: theme.colors.black.lightMedium
  }
});

type Props = {|
  type: TooltipType,
  children: string,
  testID?: string
|};

const Tooltip = ({type, children, testID}: Props) => {
  const isDarkModeActivated = useDarkMode();
  return (
    <View testID={testID}>
      <View style={[styles.container, isDarkModeActivated && styles.containerDarkMode]}>
        <View style={[styles.iconContainer, isDarkModeActivated && styles.iconContainerDarkMode]}>
          {type === TOOLTIP_TYPE.HIGHSCORE && <Star color="#fca833" style={styles.icon} />}
          {type === TOOLTIP_TYPE.UNLOCK && <Lock style={styles.icon} />}
        </View>
        <View style={styles.text}>
          <Html
            fontSize={theme.fontSize.regular}
            style={[isDarkModeActivated && styles.textDarkMode]}
          >
            {children}
          </Html>
        </View>
      </View>
      <View style={[styles.corner, isDarkModeActivated && styles.cornerDarkMode]} />
    </View>
  );
};

export default Tooltip;
