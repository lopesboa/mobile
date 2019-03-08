// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import type {Brand} from '../types';
import type {StoreState} from '../redux/store';

type ConnectedStateProps = {|
  brand: Brand
|};

type Props = {|
  ...ConnectedStateProps,
  children: React.Node
|};

type State = Brand;

const initialState: State = {
  host: 'https://onboarding.coorpacademy.com',
  colors: {
    primary: '#00B0FF'
  },
  contentCategoryName: 'Onboarding',
  name: 'onboarding',
  images: {
    'logo-mobile': 'https://static.coorpacademy.com/content/up/raw/logo_mobile-1491561428898.svg'
  }
};

export const BrandThemeContext = React.createContext(initialState);

const BrandThemeProvider = (props: Props) => {
  const {children, brand} = props;
  return <BrandThemeContext.Provider value={brand}>{children}</BrandThemeContext.Provider>;
};

const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  brand: state.authentication.brand || initialState
});

export default connect(mapStateToProps)(BrandThemeProvider);
