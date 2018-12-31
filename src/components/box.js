// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';

type Props = {|
  style?: GenericStyleProp,
  children: React.Node
|};

export const STYLE: GenericStyleProp = {
  shadowColor: theme.colors.black,
  shadowOpacity: 0.15,
  shadowOffset: {width: 0, height: 0},
  shadowRadius: 8,
  elevation: 2
};

const styles = StyleSheet.create({
  box: {
    ...STYLE
  }
});

const Box = ({style, children}: Props) => <View style={[styles.box, style]}>{children}</View>;

export default Box;
