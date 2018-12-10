// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Navigator from './navigator';
import BrandThemeProvider from './components/brand-theme-provider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <BrandThemeProvider>
    <View style={styles.container}>
      <Navigator />
    </View>
  </BrandThemeProvider>
);

export default App;
