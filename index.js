// @flow

import {AppRegistry} from 'react-native';

import StorybookUI from './storybook';
import App from './src';
import {__STORYBOOK__} from './src/modules/environment';

/* eslint-disable import/extensions */
import {name} from './app.json';

AppRegistry.registerComponent(name, () => (__STORYBOOK__ ? StorybookUI : App));
