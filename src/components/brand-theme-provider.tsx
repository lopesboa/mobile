import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import type {Brand} from '../types';
import type {StoreState} from '../redux/store';
import {getBrand} from '../redux/utils/state-extract';
import {DEFAULT_LANGUAGE} from '../translations';

interface ConnectedStateProps {
  brand: Brand;
}

interface Props extends ConnectedStateProps {
  children: React.ReactNode;
}

type State = Brand;

export const initialState: State = {
  host: 'https://onboarding.coorpacademy.com',
  colors: {
    primary: '#00B0FF',
  },
  hero: undefined,
  contentCategoryName: 'Onboarding',
  name: 'onboarding',
  images: {
    'logo-mobile':
      'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
  },
  youtube: {
    apiKey: '7Hi5iS4f4k34P1K3Y',
  },
  progressionEngine: {
    versions: {
      learner: '2',
      microlearning: '2',
    },
  },
  supportedLanguages: [DEFAULT_LANGUAGE],
  defaultLanguage: DEFAULT_LANGUAGE,
  env: '',
};

export const BrandThemeContext: React.Context<State> = React.createContext(initialState);

const BrandThemeProvider = ({children, brand}: Props) => (
  <BrandThemeContext.Provider value={brand}>{children}</BrandThemeContext.Provider>
);

const getBrandState = createSelector([getBrand], (brand) => brand || initialState);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  brand: getBrandState(state),
});

export {BrandThemeProvider as Component};
export default connect(mapStateToProps)(BrandThemeProvider);
