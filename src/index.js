// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default () => (
  <View style={styles.container}>
    <Text>@todo</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
