// @flow strict

import decode from 'jwt-decode';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import type {User, JWT} from '../../types';
import {createUser} from '../../__fixtures__/user';

export type FetchUserResponse = {
  name: {
    givenName: string,
    familyName: string
  },
  displayName: string
};

export const fetchUser = async (token: string): Promise<User> => {
  if (__E2E__) {
    return createUser();
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/api/v1/users/me`, {
    headers: {
      authorization: token
    }
  });

  const {
    displayName,
    name: {givenName, familyName}
  }: FetchUserResponse = await response.json();

  return {
    givenName,
    familyName,
    displayName
  };
};

export default {
  fetchUser
};
