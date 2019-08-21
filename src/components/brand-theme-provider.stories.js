// @flow

import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {TestContextProvider} from '../utils/tests';
import BrandThemeProvider, {BrandThemeContext} from './brand-theme-provider';

storiesOf('BrandThemeProvider', module).add('Default', () => (
  <TestContextProvider>
    <BrandThemeProvider>
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <React.Fragment>
            <Text>Host: {brandTheme.host}</Text>
            <Text style={{color: brandTheme.colors.primary}}>Primary color</Text>
            <Text>Content category name: {brandTheme.contentCategoryName}</Text>
            <Text>Name: {brandTheme.name}</Text>
            <Text>Logo: {brandTheme.images['logo-mobile']}</Text>
          </React.Fragment>
        )}
      </BrandThemeContext.Consumer>
    </BrandThemeProvider>
  </TestContextProvider>
));
