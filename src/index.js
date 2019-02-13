// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';

import Navigator from './navigator';
import BrandThemeProvider from './components/brand-theme-provider';
import NetworkInfoListener from './containers/network-info-listener';
import createStore from './redux';
import type {ReduxDevTools} from './redux/_types';

const reduxDevTools: ReduxDevTools | void =
  // eslint-disable-next-line no-undef
  window && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined;
const store = createStore(reduxDevTools);

type Props = {||};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const App = (props: Props) => (
  <Provider store={store}>
    <NetworkInfoListener />
    <BrandThemeProvider>
      <View style={styles.container}>
        <Navigator />
      </View>
    </BrandThemeProvider>
  </Provider>
);

export default App;
