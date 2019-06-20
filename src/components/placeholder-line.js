// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import LineBase from 'rn-placeholder';

import theme from '../modules/theme';
import type {FontSizeType} from '../modules/theme';

type Props = {|
  size?: 'tiny' | 'small' | 'base',
  fontSize?: FontSizeType,
  color?: string,
  width?: string | number,
  style?: ViewStyleProp
|};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  line: {
    borderRadius: 0
  },
  base: {
    height: 10
  },
  small: {
    height: 5
  },
  tiny: {
    height: 2
  }
});

const PlaceholderLine = ({
  size = 'base',
  fontSize,
  color = theme.colors.gray.light,
  width,
  style
}: Props) => (
  <View style={[styles.container, {height: fontSize && theme.fontSize[fontSize] * 1.25}, style]}>
    <LineBase
      style={[styles.line, styles[size], {backgroundColor: color}]}
      width={width || '100%'}
      noMargin
    />
  </View>
);

export default PlaceholderLine;
