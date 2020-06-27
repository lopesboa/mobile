import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Starbust from './starburst';

storiesOf('Starbust', module).add('Loose', () => (
  <Starbust spiralColor="#e13f53" backgroundColor="#e13f53" />
));
storiesOf('Starbust', module).add('Win', () => (
  <Starbust spiralColor="#3db379" backgroundColor="#3db379" testID="spiral" />
));
