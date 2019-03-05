// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import Loader from './loader';

if (process.env.NODE_ENV === 'test') {
  jest.useFakeTimers();
}

storiesOf('Loader', module).add('Default', () => <Loader height={60} />);
