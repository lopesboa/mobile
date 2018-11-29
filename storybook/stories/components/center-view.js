// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4fcff',
  },
});

const CenterView = (story: () => void) => <View style={styles.main}>{story()}</View>;

export default CenterView;
