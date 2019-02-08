// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import createDataLayer from './layer/data';

import Navigator from './navigator';
import BrandThemeProvider from './components/brand-theme-provider';
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

class App extends React.Component<Props> {
  componentDidMount() {
    // @todo use dynamic language
    const contentService = createDataLayer('fr');
    contentService.fetchDisciplineBundle();
  }

  render() {
    return (
      <Provider store={store}>
        <BrandThemeProvider>
          <View style={styles.container}>
            <Navigator />
          </View>
        </BrandThemeProvider>
      </Provider>
    );
  }
}

export default App;
