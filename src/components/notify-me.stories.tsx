import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import NotifyMe from './notify-me';

storiesOf('NotifyMe', module).add('Notify Me', () => (
  <NotifyMe onNotifyMePress={handleFakePress} onLaterPress={handleFakePress} />
));
