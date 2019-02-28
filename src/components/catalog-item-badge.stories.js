// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Badge from './catalog-item-badge';

storiesOf('Catalogue Item Badge', module).add('Default', () => (
  <Badge label="New" testID="badge" />
));
