import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import AuthenticationFooter from './authentication-footer';

storiesOf('AuthenticationFooter', module).add('Default', () => (
  <AuthenticationFooter onDemoPress={handleFakePress} onHelpPress={handleFakePress} />
));
