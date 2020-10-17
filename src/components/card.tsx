import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {ViewStyle} from 'react-native';

import theme from '../modules/theme';
import Box from './box';

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
      <Box>
      <View style={[styles.container, style, styles.overflowHidden]}>{children}</View>
      </Box>
    </View>
);

export default Card;
