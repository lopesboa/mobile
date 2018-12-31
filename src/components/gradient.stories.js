// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Gradient from './gradient';

storiesOf('Gradient', module).add('Default', () => <Gradient color="#fff" height={42} />);
