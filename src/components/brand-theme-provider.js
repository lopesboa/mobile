// @flow strict

import * as React from 'react';

import type {Theme, Colors} from '../modules/theme';
import theme from '../modules/theme';

type Props = {|
  children: React.Node,
|};

type BrandTheme = $Exact<
  Theme & {|
    colors: Colors & {
      primary: string,
    },
  |},
>;

const brandTheme: BrandTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#00B0FF',
  },
};

export const BrandThemeContext = React.createContext(brandTheme);

const BrandThemeProvider = (props: Props) => (
  <BrandThemeContext.Provider value={brandTheme}>{props.children}</BrandThemeContext.Provider>
);

export default BrandThemeProvider;
