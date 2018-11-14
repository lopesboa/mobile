// @flow

import { AppRegistry } from 'react-native';

import StorybookUI from './storybook/index';
import App from './src';
import { name } from './app.json';

// @todo RN upgrade 0.57 reminder: Remove this and change the yarn:storybook command following Storybook documentation
AppRegistry.registerComponent(
  name,
  () => (process.env.REACT_NATIVE_ENVIRONMENT_STORYBOOK ? StorybookUI : App),
);
