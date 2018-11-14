// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Home from './components/home';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const view = () => (
  <View style={styles.container}>
    <Home />
  </View>
);

export default view;
