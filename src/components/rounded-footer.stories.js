// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import RoundedFooter from './rounded-footer';

storiesOf('RoundedFooter', module).add('Default', () => (
  <RoundedFooter color="FF3300" testID="rounded-footer" />
));
