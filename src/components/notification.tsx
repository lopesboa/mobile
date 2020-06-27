import * as React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

import theme from '../modules/theme';

export const DEFAULT_HEIGHT = 10;

interface Props {
  height?: number;
  testID?: string;
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: theme.colors.notification
  }
});

const Notification = ({height = DEFAULT_HEIGHT, testID}: Props) => {
  const style: ViewStyle = {
    height,
    width: height,
    borderRadius: height
  };

  return <View style={[styles.notification, style]} testID={testID} />;
};

export default Notification;
