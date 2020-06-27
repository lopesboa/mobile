import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {NovaCompositionCoorpacademyTarget as ExampleIcon} from '@coorpacademy/nova-icons';

import AuthenticationStep from './authentication-step';

storiesOf('AuthenticationStep', module)
  .add('Default', () => (
    <AuthenticationStep
      icon={ExampleIcon}
      step={1}
      description="Go to <b>Settings > Account</b> </br>in the upper right-hand corner"
    />
  ))
  .add('Greather than 9', () => (
    <AuthenticationStep
      icon={ExampleIcon}
      step={11}
      description="Go to <b>Settings > Account</b> </br>in the upper right-hand corner"
    />
  ));
