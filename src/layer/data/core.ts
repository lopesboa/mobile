import AsyncStorage from '@react-native-community/async-storage';

import type {SupportedLanguage} from '../../translations/_types';
import type {Resource, ResourceType} from './_types';

export const buildKey = (resourceType: ResourceType, language: SupportedLanguage, ref: string) =>
  `${resourceType}:${language}:${ref}`;

export const getItem = async (
  resourceType: ResourceType,
  language: SupportedLanguage,
  ref: string,
): Promise<Resource> => {
  const key = buildKey(resourceType, language, ref);
  try {
    const item = await AsyncStorage.getItem(key);
    return JSON.parse(item);
  } catch (e) {
    throw new Error(`Resource not found with ref: ${ref}`);
  }
};

export const filterKeys = (regex: RegExp, keys: Array<string>): Array<string> =>
  keys.filter((key: string) => key.match(regex));

export const getItemsPerResourceType = async (
  resourceType: ResourceType,
  language: SupportedLanguage,
) => {
  const keys = await AsyncStorage.getAllKeys();
  const regex = new RegExp(`^(${resourceType}:${language}:(.+)+)`, 'gm');
  const filteredKeys = filterKeys(regex, keys);
  const items = await AsyncStorage.multiGet(filteredKeys);

  return items.map((item) => JSON.parse(item[1]));
};

export default {
  getItem,
  buildKey,
  getItemsPerResourceType,
};
