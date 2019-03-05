// @flow strict

import type {Brand} from '../types';

export type BrandsService = {|
  find: (token: string) => Promise<Brand>
|};

const service = (): BrandsService => ({
  find: () =>
    Promise.resolve({
      name: 'mobile',
      baseUrl: 'https://mobile-staging.coorpacademy.com',
      contentCategoryName: 'Mobile'
    })
});

export default service;
