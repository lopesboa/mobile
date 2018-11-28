// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Text from './text';

storiesOf('Text', module).add('Default', () => <Text>foo</Text>);
