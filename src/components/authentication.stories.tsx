import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import Authentication from './authentication';

storiesOf('Authentication', module).add('Default', () => (
  <Authentication
    onHelpPress={handleFakePress}
    onDemoPress={handleFakePress}
    onDesktopButtonPress={handleFakePress}
    onMobileButtonPress={handleFakePress}
  />
));
