import AsyncStorage from '@react-native-community/async-storage';

import {Brand} from '../types';

type Data = Brand;

const ASYNC_STORAGE_KEY = '@@brand';

export const get = async (): Promise<Data | null> => {
  const data = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};
export const set = (data: Data): Promise<void> =>
  AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(data));
export const remove = () => AsyncStorage.removeItem(ASYNC_STORAGE_KEY);

export default {
  get,
  set,
  remove,
};
