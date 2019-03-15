// @flow

import {AsyncStorage} from 'react-native';

type Token = string | null;

const localToken = {
  get: async (): Promise<string | null> => {
    const token: Token = await AsyncStorage.getItem('@@token');
    return token;
  },
  set: (token: Token) => {
    if (!token) return;
    return AsyncStorage.setItem('@@token', token);
  },
  remove: () => {
    AsyncStorage.removeItem('@@token');
  }
};

export default localToken;
