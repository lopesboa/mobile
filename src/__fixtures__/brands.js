// @flow strict

import type {Brand} from '../types';

export const createBrand = (): Brand => ({
  name: 'mobile',
  host: 'https://mobile-staging.coorpacademy.com',
  contentCategoryName: 'Mobile',
  colors: {
    primary: '#00B0FF'
  },
  images: {
    'logo-mobile':
      'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png'
  }
});
