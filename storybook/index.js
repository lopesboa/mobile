// @flow

import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import './addons';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' });
AppRegistry.registerComponent('ADM', () => StorybookUI);
