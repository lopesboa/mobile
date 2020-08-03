import {AppRegistry} from 'react-native';

import StorybookUI from './storybook';
import App from './src';
import {__STORYBOOK__, __DEV__, __E2E__} from './src/modules/environment';

/* eslint-disable import/extensions */
import {name} from './app.json';

if (__STORYBOOK__ || __DEV__ || __E2E__) {
  const AsyncStorage = require('@react-native-community/async-storage').default;
  const RNAsyncStorageFlipper = require('rn-async-storage-flipper').default;
  RNAsyncStorageFlipper(AsyncStorage);
}

if (__STORYBOOK__ || __DEV__) {
  require('react-native').unstable_enableLogBox();
}
AppRegistry.registerComponent(name, () => (__STORYBOOK__ ? StorybookUI : App));
