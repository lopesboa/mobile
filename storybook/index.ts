import {getStorybookUI, configure} from '@storybook/react-native';
import splashScreen from 'react-native-splash-screen';

import './addons';

splashScreen.hide();

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI();

export default StorybookUI;
