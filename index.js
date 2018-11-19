// @flow
import {AppRegistry} from 'react-native';

import StorybookUI from './storybook';
import App from './src';

/* eslint-disable import/extensions*/
import {name} from './app.json';

// @todo RN upgrade 0.57 reminder: Remove this and change the yarn:storybook command following Storybook documentation
AppRegistry.registerComponent(
  name,
  () => (process.env.REACT_NATIVE_ENVIRONMENT_STORYBOOK ? StorybookUI : App),
);
