import AsyncStorage from '@react-native-community/async-storage';

type Data = string;

const ASYNC_STORAGE_KEY = '@@token';

export const get = (): Promise<Data | null> => AsyncStorage.getItem(ASYNC_STORAGE_KEY);
export const set = (data: Data): Promise<void> => AsyncStorage.setItem(ASYNC_STORAGE_KEY, data);
export const remove = () => AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
