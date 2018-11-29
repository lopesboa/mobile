// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Navigator from './navigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <View style={styles.container}>
    <Navigator />
  </View>
);

export default App;
