// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider} from '../utils/tests';
import BrandLogo from './brand-logo';

storiesOf('BrandLogo', module).add('Default', () => (
  <TestContextProvider>
    <BrandLogo height={37} />
  </TestContextProvider>
));
