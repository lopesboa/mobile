// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const CenterView = (story: () => void) => (
  <View style={styles.main}>
    {story()}
  </View>
);

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#f4fcff',
  },
});

export default CenterView;
