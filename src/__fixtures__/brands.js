// @flow strict

import type {Brand} from '../types';

// eslint-disable-next-line import/prefer-default-export
export const createBrand = (): Brand => ({
  name: 'mobile',
  baseUrl: 'https://mobile-staging.coorpacademy.com',
  contentCategoryName: 'Mobile'
});
