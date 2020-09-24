import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {ViewStyle} from 'react-native';

import theme from '../modules/theme';

export interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.card,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

const Card = ({children, style, testID}: Props) => (
  <View style={styles.container} testID={testID}>
    <View style={[styles.container, style, styles.overflowHidden]}>{children}</View>
  </View>
);

export default Card;
