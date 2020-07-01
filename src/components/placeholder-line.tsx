import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {PlaceholderLine as PlaceholderLineBase} from 'rn-placeholder';

import theme from '../modules/theme';
import type {FontSizeType} from '../modules/theme';

interface Props {
  size?: 'tiny' | 'small' | 'base' | 'large';
  fontSize?: FontSizeType;
  color?: string;
  width?: string | number;
  isCentered?: boolean;
  style?: ViewStyle;
}

export const LARGE_HEIGHT = 16;
export const BASE_HEIGHT = 10;
export const SMALL_HEIGHT = 5;
export const TINY_HEIGHT = 2;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  line: {
    borderRadius: 0,
  },
  large: {
    height: LARGE_HEIGHT,
  },
  base: {
    height: BASE_HEIGHT,
  },
  small: {
    height: SMALL_HEIGHT,
  },
  tiny: {
    height: TINY_HEIGHT,
  },
});

const PlaceholderLine = ({
  size = 'base',
  fontSize,
  color = theme.colors.gray.light,
  width,
  isCentered,
  style,
}: Props) => (
  <View
    style={[
      styles.container,
      isCentered && styles.centered,
      {height: fontSize && theme.fontSize[fontSize] * 1.25},
      style,
    ]}
  >
    <PlaceholderLineBase
      style={[styles.line, styles[size], {backgroundColor: color}]}
      width={width || '100%'}
      noMargin
    />
  </View>
);

export default PlaceholderLine;
