// @flow

import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import {TestContextProvider} from '../utils/tests';

import BrandThemeProvider, {BrandThemeContext} from './brand-theme-provider';

storiesOf('BrandThemeProvider', module).add('Colors', () => (
  <TestContextProvider>
    <BrandThemeProvider>
      <BrandThemeContext.Consumer>
        {brandTheme => <Text style={{color: brandTheme.colors.primary}}>Primary color</Text>}
      </BrandThemeContext.Consumer>
    </BrandThemeProvider>
  </TestContextProvider>
));
