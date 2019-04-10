// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import theme from '../modules/theme';
import Button from './button';
import type {Props as ButtonProps} from './button';
import Gradient from './gradient';

export type Props = $Exact<{|
  ...WithLayoutProps,
  ...ButtonProps
|}>;

export const HEIGHT = 140;

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    height: HEIGHT,
    bottom: 0,
    width: '100%'
  },
  cta: {
    position: 'absolute',
    bottom: theme.spacing.base,
    left: theme.spacing.base
  }
});

const ButtonSticky = ({onLayout, layout, containerStyle, ...props}: Props) => (
  <React.Fragment>
    <View style={styles.gradient} pointerEvents="none" onLayout={onLayout}>
      <Gradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
    {layout && (
      <View style={[styles.cta, {width: layout.width - theme.spacing.base * 2}]}>
        <Button {...props} isInverted />
      </View>
    )}
  </React.Fragment>
);

export {ButtonSticky as Component};
export default withLayout(ButtonSticky, {
  withoutContainer: true
});
