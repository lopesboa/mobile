// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import BrandThemeProvider, {BrandThemeContext} from './brand-theme-provider';

storiesOf('BrandThemeProvider', module)
  .add('Colors', () => (
    <BrandThemeProvider>
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View>
            <Text style={{color: brandTheme.colors.primary}}>Primary color</Text>
            <Text style={{color: brandTheme.colors.gray.extra}}>Gray extra</Text>
            <Text style={{color: brandTheme.colors.gray.light}}>Gray light</Text>
            <Text style={{color: brandTheme.colors.gray.medium}}>Gray medium</Text>
            <Text style={{color: brandTheme.colors.gray.dark}}>Gray dark</Text>
            <Text style={{color: brandTheme.colors.negative}}>Negative</Text>
            <Text style={{color: brandTheme.colors.positive}}>Positive</Text>
            <Text style={{color: brandTheme.colors.white}}>White</Text>
            <Text style={{color: brandTheme.colors.black}}>Black</Text>
            <Text style={{color: brandTheme.colors.battle}}>Battle</Text>
          </View>
        )}
      </BrandThemeContext.Consumer>
    </BrandThemeProvider>
  ))
  .add('Spacing', () => (
    <BrandThemeProvider>
      <BrandThemeContext.Consumer>
        {brandTheme => {
          const commonStyle = {borderWidth: 1};
          return (
            <View>
              <Text style={[commonStyle, {padding: brandTheme.spacing.tiny}]}>Tiny</Text>
              <Text style={[commonStyle, {padding: brandTheme.spacing.small}]}>Small</Text>
              <Text style={[commonStyle, {padding: brandTheme.spacing.base}]}>Base</Text>
              <Text style={[commonStyle, {padding: brandTheme.spacing.large}]}>Large</Text>
            </View>
          );
        }}
      </BrandThemeContext.Consumer>
    </BrandThemeProvider>
  ))
  .add('Radius', () => (
    <BrandThemeProvider>
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View
            style={{
              borderRadius: brandTheme.radius.button,
              borderWidth: 1,
              padding: 8,
            }}
          >
            <Text>Button</Text>
          </View>
        )}
      </BrandThemeContext.Consumer>
    </BrandThemeProvider>
  ));
