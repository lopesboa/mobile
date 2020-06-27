import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import Overlay from './overlay';

storiesOf('Overlay', module).add('Default', () => (
  <Overlay>
    <Text>Foo bar baz</Text>
  </Overlay>
));
