// @flow strict

import type {SpaceType} from '../types';

export type Colors = {
  gray: {
    extra: string,
    light: string,
    lightMedium: string,
    medium: string,
    dark: string,
  },
  negative: string,
  positive: string,
  white: string,
  black: string,
  battle: string,
};

export type Theme = {|
  colors: Colors,
  spacing: {
    [SpaceType]: number,
  },
  radius: {
    common: number,
    button: number,
  },
|};

const theme: Theme = {
  colors: {
    gray: {
      extra: '#FAFAFA',
      light: '#ECEFF1',
      lightMedium: '#CFD8DC',
      medium: '#90A4AE',
      dark: '#546E7A',
    },
    negative: '#F73F52',
    positive: '#3EC483',
    white: '#FFFFFF',
    black: '#14171A',
    battle: '#FFE100',
  },
  spacing: {
    tiny: 8,
    small: 16,
    base: 24,
    large: 48,
    xlarge: 64,
  },
  radius: {
    common: 3,
    button: 32,
  },
};

export default theme;
