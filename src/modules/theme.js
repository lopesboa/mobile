// @flow strict

import type {SpaceType} from '../types';

export type Colors = {
  border: string,
  gray: {
    extra: string,
    light: string,
    lightMedium: string,
    medium: string,
    dark: string
  },
  negative: string,
  positive: string,
  white: string,
  black: string,
  battle: string
};

export type FontWeightType = 'bold' | 'semiBold' | 'regular';

export type Theme = {|
  colors: Colors,
  spacing: {
    [SpaceType]: number
  },
  radius: {
    common: number,
    card: number,
    medium: number,
    button: number,
    thumbnail: number
  },
  fontWeight: {
    [FontWeightType]: FontWeight
  }
|};

const theme: Theme = {
  colors: {
    border: 'rgba(0, 0, 0, 0.1)',
    gray: {
      extra: '#FAFAFA',
      light: '#ECEFF1',
      lightMedium: '#CFD8DC',
      medium: '#90A4AE',
      dark: '#546E7A'
    },
    negative: '#F73F52',
    positive: '#3EC483',
    white: '#FFFFFF',
    black: '#14171A',
    battle: '#FFE100'
  },
  spacing: {
    micro: 4,
    tiny: 8,
    small: 16,
    base: 24,
    large: 48,
    xlarge: 64
  },
  radius: {
    common: 3,
    card: 5,
    medium: 12,
    button: 32,
    thumbnail: 1000
  },
  fontWeight: {
    regular: '400',
    semiBold: '500',
    bold: '700'
  }
};

export default theme;
