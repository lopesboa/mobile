// @flow

import {AppRegistry} from 'react-native';

import StorybookUI from './storybook';
import App from './src';
import {__STORYBOOK__, __DEV__} from './src/modules/environment';

/* eslint-disable import/extensions */
import {name} from './app.json';

if (__DEV__) {
  require('react-native').unstable_enableLogBox();
}

AppRegistry.registerComponent(name, () => (__STORYBOOK__ ? StorybookUI : App));
