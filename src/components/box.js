// @flow strict

import * as React from 'react';
import {StyleSheet, View, Platform} from 'react-native';

import theme from '../modules/theme';

type Props = {|
  style?: GenericStyleProp,
  children: React.Node
|};

export const STYLE: GenericStyleProp = {
  ...Platform.select({
    android: {
      backgroundColor: 'rgba(0,0,0,0.015)' // fix shadow not visible bug on android
    }
  }),
  shadowColor: theme.colors.black,
  shadowOpacity: 0.15,
  shadowOffset: {width: 0, height: 0},
  shadowRadius: 8,
  elevation: 4
};

const styles = StyleSheet.create({
  box: {
    ...STYLE
  }
});

const Box = ({style, children}: Props) => <View style={[styles.box, style]}>{children}</View>;

export default Box;
