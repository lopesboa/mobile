// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import type {Progression} from '../types';
import CatalogItemFooter from './catalog-item-footer';

const progression: Progression = {
  current: 3,
  count: 10
};

storiesOf('Catalog Item Footer', module).add('Default', () => (
  <CatalogItemFooter
    isCourse
    title="Cours Test"
    subtitle="Coorpacademy"
    isCertified
    isAdaptive
    progression={progression}
    testID="catalog-item-footer"
  />
));
