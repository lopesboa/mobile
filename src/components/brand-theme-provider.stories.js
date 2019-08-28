// @flow

import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {createBrand} from '../__fixtures__/brands';
import {CONTENT_TYPE, ENGINE} from '../const';
import {createProgression} from '../__fixtures__/progression';
import {createStoreState, createAuthenticationState} from '../__fixtures__/store';
import {__TEST__} from '../modules/environment';
import {
  BrandThemeContext,
  Component as BrandThemeProvider,
  mapStateToProps
} from './brand-theme-provider';

const brand = createBrand({});

storiesOf('BrandThemeProvider', module).add('Default', () => (
  <BrandThemeProvider brand={brand}>
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
));

if (__TEST__) {
  describe('mapStateToProps', () => {
    it('should return the state brand', () => {
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: ''
        }
      });
      const state = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        authentication: createAuthenticationState({})
      });

      const result = mapStateToProps(state);
      expect(result.brand).toEqual(brand);
    });
    it('should return the default brand', () => {
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: ''
        }
      });
      const state = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        authentication: {
          brand: null
        }
      });

      const result = mapStateToProps(state);
      expect(result.brand.name).toEqual('onboarding');
    });
  });
}
