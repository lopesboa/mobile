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
  battle: string,
  notification: string,
  salmon: string
};

export type FontWeightType = 'extraBold' | 'bold' | 'semiBold' | 'regular';

export type FontSizeType =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'regular'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | 'xxxlarge';

export type Theme = {|
  colors: Colors,
  spacing: {
    [SpaceType]: number
  },
  radius: {
    common: number,
    card: number,
    medium: number,
    search: number,
    button: number,
    thumbnail: number
  },
  fontWeight: {
    [FontWeightType]: FontWeight
  },
  fontSize: {
    [FontSizeType]: FontSize
  },
  letterSpacing: {
    header: number
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
    battle: '#FFE100',
    notification: '#FF7043',
    salmon: '#FDE2E5'
  },
  spacing: {
    micro: 4,
    tiny: 8,
    small: 16,
    base: 24,
    medium: 32,
    large: 48,
    xlarge: 64
  },
  radius: {
    common: 3,
    card: 5,
    medium: 12,
    search: 24,
    button: 32,
    thumbnail: 1000
  },
  fontWeight: {
    regular: '400',
    semiBold: '500',
    bold: '700',
    extraBold: '900'
  },
  fontSize: {
    extraSmall: 10,
    small: 12,
    medium: 13,
    regular: 15,
    large: 17,
    xlarge: 22,
    xxlarge: 28,
    xxxlarge: 40
  },
  letterSpacing: {
    header: 5
  }
};

export const BLUE_COORP_LIGHT: string = '#00B0FF';
export const BLUE_COORP_DARK: string = '#4481EB';

export const getHitSlop = (type: SpaceType = 'small'): HitSlop => ({
  left: theme.spacing[type],
  top: theme.spacing[type],
  right: theme.spacing[type],
  bottom: theme.spacing[type]
});

export default theme;
