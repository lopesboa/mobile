// @flow strict

import decode from 'jwt-decode';
import fetch from 'cross-fetch';
import {__E2E__} from '../../modules/environment';
import type {Brand, JWT} from '../../types';
import {createBrand} from '../../__fixtures__/brands';

export type Config = {
  brand: {
    name: string,
    baseUrl: string,
    contentCategoryName: string
  },
  themes: [
    {
      common: {
        primary: string
      },
      images: {
        'logo-mobile': string
      }
    }
  ]
};

export const fetchBrand = async (token: string): Promise<Brand> => {
  if (__E2E__) {
    return createBrand();
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/config`, {
    headers: {
      authorization: token
    }
  });

  const body: Config = await response.json();
  return {
    name: body.brand.name,
    host: body.brand.baseUrl || 'https://mobile-staging.coorpacademy.com',
    contentCategoryName: body.brand.contentCategoryName,
    colors: {
      primary: body.themes[0].common.primary
    },
    images: {
      'logo-mobile': body.themes[0].images['logo-mobile']
    }
  };
};

export default {
  fetchBrand
};
