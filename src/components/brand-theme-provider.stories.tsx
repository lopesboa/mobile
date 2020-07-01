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
  mapStateToProps,
  initialState,
} from './brand-theme-provider';

const brand = createBrand({});

storiesOf('BrandThemeProvider', module).add('Default', () => (
  <BrandThemeProvider brand={brand}>
    <BrandThemeContext.Consumer>
      {(brandTheme) => <Text>{JSON.stringify(brandTheme, null, '\t')}</Text>}
    </BrandThemeContext.Consumer>
  </BrandThemeProvider>
));

if (__TEST__) {
  describe('mapStateToProps', () => {
    it('should return the brand from state', () => {
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: '',
        },
      });
      const state = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        authentication: createAuthenticationState({brand}),
      });

      const result = mapStateToProps(state);
      expect(result.brand).toEqual(brand);
    });

    it('should return the initial state', () => {
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: '',
        },
      });
      const state = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        authentication: createAuthenticationState({brand: null}),
      });

      const result = mapStateToProps(state);
      expect(result.brand).toEqual(initialState);
    });
  });
}
