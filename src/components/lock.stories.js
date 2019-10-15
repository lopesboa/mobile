// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Lock from './lock';

storiesOf('Lock', module).add('Default (height: 200)', () => <Lock height={200} />);
