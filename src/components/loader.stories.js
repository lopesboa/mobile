// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Loader from './loader';

storiesOf('Loader', module).add('Default', () => <Loader height={60} />);
