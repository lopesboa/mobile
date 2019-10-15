// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Heart from './heart';

storiesOf('Heart', module).add('Default (height: 200)', () => <Heart height={200} />);
