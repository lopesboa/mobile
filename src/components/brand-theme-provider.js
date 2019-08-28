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
    'logo-mobile':
      'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png'
  },
  progressionEngine: {
    versions: {
      learner: '2',
      microlearning: '2'
    }
  }
};

export const BrandThemeContext: React.Context<State> = React.createContext(initialState);

const BrandThemeProvider = ({children, brand}: Props) => (
  <BrandThemeContext.Provider value={brand}>{children}</BrandThemeContext.Provider>
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  brand: state.authentication.brand || initialState
});

export {BrandThemeProvider as Component};
export default connect(mapStateToProps)(BrandThemeProvider);
