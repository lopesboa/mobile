import Promise from 'bluebird';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash/fp';

import type {Migrations, PairedMigrations, Transformer, Predicate} from './types';

const ASYNC_STORAGE_VERSION_KEY = 'async_storage_version';

const applyMigration = (predicate: Predicate, transformer: Transformer) => async (
  asyncStorage: typeof AsyncStorage,
): Promise<void> => {
  const allASKeys = await asyncStorage.getAllKeys();

  return Promise.mapSeries(allASKeys, async (key) => {
    if (predicate(key)) {
      const value = await asyncStorage.getItem(key);
      if (value) {
        const nextValue = await transformer(value, key);
        if (nextValue && value !== nextValue) {
          await asyncStorage.setItem(key, nextValue);
        }
      }
    }
  });
};

const applyMigrations = (asyncStorageVersionKey, migrations) => async (
  asyncStorage: typeof AsyncStorage,
): Promise<void> => {
  const currentASVersion = (await asyncStorage.getItem(asyncStorageVersionKey)) || '1';
  return _.pipe(
    _.toPairs,
    _.map(_.update('0', _.parseInt(10))),
    _.filter(([version]) => version > parseInt(currentASVersion)),
    _.sortBy('0'),
    (vm: PairedMigrations) =>
      Promise.mapSeries(vm, async ([version, [predicate, transformer]]) => {
        await applyMigration(predicate, transformer)(asyncStorage);
        await asyncStorage.setItem(asyncStorageVersionKey, version.toString());
      }),
  )(migrations);
};

export const runMigrations = (migrations: Migrations): Promise<void> =>
  applyMigrations(ASYNC_STORAGE_VERSION_KEY, migrations)(AsyncStorage);
