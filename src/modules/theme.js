// @flow strict

import type {SpaceType} from '../types';

type Theme = {|
  colors: {
    primary: {
      default: string,
      additional1: string,
      additional2: string,
      additional3: string,
      additional4: string,
    },
    gray: {
      extra: string,
      light: string,
      medium: string,
      dark: string,
    },
    brand: {
      yellow: string,
      green: string,
      gray: string,
      orange: string,
    },
    negative: string,
    positive: string,
    white: string,
    battle: string,
    black: string,
  },
  spacing: {
    [SpaceType]: number,
  },
  radius: {
    button: number,
  },
|};

const theme: Theme = {
  colors: {
    primary: {
      default: '#00B0FF',
      additional1: '#B3E5FC',
      additional2: '#0091EA',
      additional3: '#0277BD',
      additional4: '#01579B',
    },
    gray: {
      extra: '#FAFAFA',
      light: '#ECEFF1',
      medium: '#90A4AE',
      dark: '#546E7A',
    },
    brand: {
      yellow: '#FFA000',
      green: '#66BB6A',
      gray: '#607D8B',
      orange: '#FF7043',
    },
    negative: '#F73F52',
    positive: '#3EC483',
    white: '#FFFFFF',
    battle: '#FFE100',
    black: '#14171A',
  },
  spacing: {
    tiny: 8,
    small: 16,
    base: 24,
    large: 48,
  },
  radius: {
    button: 24,
  },
};

export default theme;
