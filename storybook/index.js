// @flow

import {getStorybookUI, configure} from '@storybook/react-native';
import './addons';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI();

export default StorybookUI;
