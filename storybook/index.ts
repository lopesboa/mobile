import {getStorybookUI, configure} from '@storybook/react-native';
import RNBootSplash from 'react-native-bootsplash';

import './addons';
import {__STORYBOOK__} from '../src/modules/environment';

if (__STORYBOOK__) {
  RNBootSplash.hide();
}

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI();

export default StorybookUI;
