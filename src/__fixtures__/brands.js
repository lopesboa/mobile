// @flow strict

import type {Brand} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createBrand = (): Brand => ({
  name: 'mobile',
  host: 'https://mobile-staging.coorpacademy.com',
  contentCategoryName: 'Mobile',
  colors: {
    primary: '#00B0FF'
  },
  images: {
    'logo-mobile':
      'https://static.coorpacademy.com/content/7steps/raw/logo_loreal-1500561107159.svg'
  }
});
