// @flow

import AsyncStorage from '@react-native-community/async-storage';

type Token = string | null;

const ASYNC_STORAGE_KEY = '@@token';

export const get = (): Promise<Token> => AsyncStorage.getItem(ASYNC_STORAGE_KEY);
export const set = async (token: Token): Promise<void> => {
  if (!token) {
    return;
  }
  const result = await AsyncStorage.setItem(ASYNC_STORAGE_KEY, token);

  return result;
};
export const remove = () => AsyncStorage.removeItem(ASYNC_STORAGE_KEY);

export default {
  get,
  set,
  remove
};
