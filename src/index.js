// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Home from './components/Home';

export default () => (
  <View style={styles.container}>
    <Home />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
