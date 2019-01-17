// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Lives from './lives';

storiesOf('Lives', module)
  .add('Default', () => <Lives count={3} height={60} />)
  .add('Broken', () => <Lives count={2} isBroken height={60} />)
  .add('Bigger height', () => <Lives count={3} height={120} />);
