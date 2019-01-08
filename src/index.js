// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';

import Navigator from './navigator';
import BrandThemeProvider from './components/brand-theme-provider';
import store from './redux';

type Props = {||};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const App = (props: Props) => (
  <Provider store={store}>
    <BrandThemeProvider>
      <View style={styles.container}>
        <Navigator />
      </View>
    </BrandThemeProvider>
  </Provider>
);

export default App;
