// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Line as LineBase} from 'rn-placeholder';

import theme from '../modules/theme';
import type {FontSizeType} from '../modules/theme';

type Props = {|
  size?: 'tiny' | 'small' | 'base',
  fontSize?: FontSizeType,
  color?: string,
  width?: string
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
  width = '100%'
}: Props) => (
  <View style={[styles.container, {height: fontSize && theme.fontSize[fontSize] * 1.25}]}>
    <LineBase
      style={[styles.line, styles[size], {backgroundColor: color}]}
      width={width}
      noMargin
    />
  </View>
);

export default PlaceholderLine;
