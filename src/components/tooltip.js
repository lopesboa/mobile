// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  NovaCompositionCoorpacademyStar as Star,
  NovaCompositionCoorpacademyLock as Lock,
  NovaCompositionCoorpacademyTooltipCorner as TooltipCorner
} from '@coorpacademy/nova-icons';
import theme from '../modules/theme';
import {TOOLTIP_TYPE} from '../const';
import type {TooltipType} from '../types';
import Html from './html';
import {STYLE as BOX_STYLE} from './box';

type Props = {|
  type: TooltipType,
  text: string
|};

const styles = StyleSheet.create({
  container: {
    ...BOX_STYLE,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    flexDirection: 'row',
    padding: theme.spacing.small,
    marginLeft: 5,
    marginRight: 1
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {width: 21, height: 21},
  text: {paddingHorizontal: theme.spacing.base},
  corner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 16,
    height: 14
  }
});

const Tooltip = ({type, text}: Props) => {
  return (
    <View>
      <TooltipCorner style={styles.corner} color={theme.colors.white} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {type === TOOLTIP_TYPE.HIGHSCORE && <Star color="#fca833" style={styles.icon} />}
          {type === TOOLTIP_TYPE.UNLOCK && <Lock style={styles.icon} />}
        </View>
        <View style={styles.text}>
          <Html fontSize={theme.fontSize.regular}>{text}</Html>
        </View>
      </View>
    </View>
  );
};
export default Tooltip;
