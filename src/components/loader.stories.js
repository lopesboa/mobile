// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {__TEST__} from '../modules/environment';
import Loader from './loader';

if (__TEST__) {
  jest.useFakeTimers();
}

storiesOf('Loader', module).add('Default', () => <Loader height={60} />);
