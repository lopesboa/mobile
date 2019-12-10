// @flow
import Promise from 'bluebird';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash/fp';
import type {Migrations} from './types';

const applyMigration = (predicate, migration) => async (asyncStorage: typeof AsyncStorage) => {
  const allASKeys = await asyncStorage.getAllKeys();

  return Promise.mapSeries(allASKeys, async key => {
    if (predicate(key)) {
      const value = await asyncStorage.getItem(key);
      const nextValue = await migration(value, key);
      if (value !== nextValue) {
        await asyncStorage.setItem(key, nextValue);
      }
    }
  });
};

const applyMigrations = (asyncStorageVersionKey, migrations) => async (
  asyncStorage: typeof AsyncStorage
) => {
  const currentASVersion = (await asyncStorage.getItem(asyncStorageVersionKey)) || 1;
  return _.pipe(
    _.toPairs,
    _.map(_.update('0', _.parseInt(10))),
    _.filter(([version]) => version > currentASVersion),
    _.sortBy('0'),
    vm =>
      Promise.mapSeries(vm, async ([version, [predicate, migration]]) => {
        await applyMigration(predicate, migration)(asyncStorage);
        await asyncStorage.setItem(asyncStorageVersionKey, version);
      })
  )(migrations);
};

export const runMigrations = async (migrations: Migrations): Promise<void> => {
  try {
    const AsyncStorageVersionKey = 'async_storage_version';
    await applyMigrations(AsyncStorageVersionKey, migrations)(AsyncStorage);
  } catch (error) {
    throw error;
  }
};
