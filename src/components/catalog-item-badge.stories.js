// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import translations from '../translations';

import Badge from './catalog-item-badge';

storiesOf('Catalog Item Badge', module).add('Default', () => (
  <Badge label={translations.new} testID="badge" />
));
