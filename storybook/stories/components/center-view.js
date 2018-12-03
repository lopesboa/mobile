// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../../../src/modules/theme';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
});

const CenterView = (story: () => void) => <View style={styles.main}>{story()}</View>;

export default CenterView;
