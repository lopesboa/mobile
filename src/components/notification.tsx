import * as React from 'react';
import {Text, View, StyleSheet, ViewStyle, Platform} from 'react-native';

import theme from '../modules/theme';

export const DEFAULT_HEIGHT = 10;

interface Props {
  height?: number;
  testID?: string;
  color?: string;
  label?: string;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.xxlarge,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
});

const Notification = ({ height = DEFAULT_HEIGHT, style, color, label, testID}: Props) => {
  const containerStyle: ViewStyle = {
    ...style,
    height,
    width: height,
    borderRadius: height,
    backgroundColor: color ? color : theme.colors.notification,
  };

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={[styles.label, {textAlign: 'center', fontSize: height - 5}]}>{label}</Text>
    </View>
  );
};

export default Notification;
