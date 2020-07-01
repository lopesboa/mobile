import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  NovaCompositionCoorpacademyStar as Star,
  NovaCompositionCoorpacademyLock as Lock,
} from '@coorpacademy/nova-icons';
import theme from '../modules/theme';
import {TOOLTIP_TYPE} from '../const';
import type {TooltipType} from '../types';
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
    marginRight: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 21,
    height: 21,
  },
  text: {
    paddingHorizontal: theme.spacing.base,
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
    borderBottomColor: theme.colors.white,
  },
});

interface Props {
  type: TooltipType;
  children: string;
  testID?: string;
}

const Tooltip = ({type, children, testID}: Props) => {
  return (
    <View testID={testID}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {type === TOOLTIP_TYPE.HIGHSCORE ? <Star color="#fca833" style={styles.icon} /> : null}
          {type === TOOLTIP_TYPE.UNLOCK ? <Lock style={styles.icon} /> : null}
        </View>
        <View style={styles.text}>
          <Html fontSize={theme.fontSize.regular}>{children}</Html>
        </View>
      </View>
      <View style={styles.corner} />
    </View>
  );
};
export default Tooltip;
