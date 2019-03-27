// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import type {Layout} from '../containers/with-layout';
import theme from '../modules/theme';
import StickyButton from './button';
import Gradient from './gradient';

export type Props = {|
  children: string | React$Node,
  onPress: () => void,
  testID?: string,
  layout?: Layout,
  onLayout?: () => void
|};

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

const ButtonSticky = ({children, onPress, testID, layout, onLayout}: Props) => {
  return (
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
          <StickyButton isInverted onPress={onPress} testID={testID}>
            {children}
          </StickyButton>
        </View>
      )}
    </React.Fragment>
  );
};

export default ButtonSticky;
