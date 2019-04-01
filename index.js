// @flow

import {AppRegistry} from 'react-native';

import StorybookUI from './storybook';
import App from './src';
import {__STORYBOOK__} from './src/modules/environment';

/* eslint-disable import/extensions */
import {name} from './app.json';

// @todo RN upgrade 0.57 reminder: Remove this and change the yarn:storybook command following Storybook documentation
AppRegistry.registerComponent(name, () => (__STORYBOOK__ ? StorybookUI : App));
