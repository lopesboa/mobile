import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {Migrations} from './types';

describe('Migrations runner', () => {
  it('should run one migration script and bump async storage version from default to script version even if the value did not change', async () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations: Migrations = {
      '2': [(key) => key.startsWith('@@token'), (value, key) => Promise.resolve(value)],
    };

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'card:en:mod_4JotIQRFWj',
        'synchronized_progressions',
      ]),
    );
    AsyncStorage.getItem = jest.fn(
      (key) => key.startsWith('@@token') && Promise.resolve('baseToken'),
    );
    AsyncStorage.setItem = jest.fn().mockImplementationOnce((key, value) => {
      expect(key).toBe('async_storage_version');
      expect(value).toEqual('2');
    });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should run one migration script and bump async storage version even if the value is empty', async () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations = {
      '2': [
        (key) => key.startsWith('@@token'),
        (value, key) => {
          return Promise.resolve(value);
        },
      ],
    };

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'card:en:mod_4JotIQRFWj',
        'synchronized_progressions',
      ]),
    );
    AsyncStorage.getItem = jest.fn(
      (key) => key.startsWith('@@token') && Promise.resolve(undefined),
    );
    AsyncStorage.setItem = jest.fn().mockImplementationOnce((key, value) => {
      expect(key).toBe('async_storage_version');
      expect(value).toEqual('2');
    });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should run one migration script and bump async storage version from default to script version', async () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations: Migrations = {
      '2': [
        (key) => key.startsWith('@@token'),
        (value, key) => Promise.resolve(`${value}_@coorpacademy`),
      ],
    };

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'card:en:mod_4JotIQRFWj',
        'synchronized_progressions',
      ]),
    );
    AsyncStorage.getItem = jest.fn(
      (key) => key.startsWith('@@token') && Promise.resolve('baseToken'),
    );
    AsyncStorage.setItem = jest
      .fn()
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('@@token');
        expect(value).toEqual('baseToken_@coorpacademy');
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('async_storage_version');
        expect(value).toEqual('2');
      });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('should not run the migration script if the async storage version is greater or equal than the provided migration version', async () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations: Migrations = {
      '2': [
        (key) => key.startsWith('@@token'),
        (value, key) => Promise.resolve(`${value}_@coorpacademy`),
      ],
    };

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'card:en:mod_4JotIQRFWj',
        'synchronized_progressions',
      ]),
    );

    AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(2));
    AsyncStorage.setItem = jest.fn();

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('should run multiple migration scripts and bump async storage version for each', async () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations: Migrations = {
      '3': [
        (key) => key.startsWith('@@token'),
        (value, key) => Promise.resolve(`${value}_@coorpacademy`),
      ],
      '4': [
        (key) => key.startsWith('progression'),
        (value, key) => {
          const progression = JSON.parse(value);
          progression._id = 'newProgressionId';
          return Promise.resolve(JSON.stringify(progression));
        },
      ],
    };

    const goodProgression = createProgression({
      _id: 'successProgressionId',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'mod_1',
        type: CONTENT_TYPE.LEVEL,
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: 'suc_1',
        },
      },
    });

    AsyncStorage.getItem = jest.fn((key) => {
      if (key.startsWith('@@token')) return Promise.resolve('baseToken');
      if (key.startsWith('progression')) return Promise.resolve(JSON.stringify(goodProgression));
      if (key.startsWith('async_')) return Promise.resolve(2);
    });

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'progression_5dee52c8a7da3a8443ed7a3a',
      ]),
    );

    AsyncStorage.setItem = jest
      .fn()
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('@@token');
        expect(value).toEqual('baseToken_@coorpacademy');
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('async_storage_version');
        expect(value).toEqual('3');
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('progression_5dee52c8a7da3a8443ed7a3a');
        expect(JSON.parse(value)._id).toEqual('newProgressionId');
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('async_storage_version');
        expect(value).toEqual('4');
      });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(4);
  });

  it('should run multiple migration scripts and catch and stop migration if a script fails', () => {
    const {runMigrations} = require('./runner');
    const AsyncStorage = require('@react-native-community/async-storage');
    const migrations: Migrations = {
      '3': [
        (key) => key.startsWith('@@token'),
        (value, key) => Promise.resolve(`${value}_@coorpacademy`),
      ],
      '4': [
        (key) => key.startsWith('progression'),
        (value, key) => {
          const progression = JSON.parse(value);
          progression._id = 'badProgressionId';
          return Promise.reject(new Error('Something bad happened'));
        },
      ],
      '5': [
        (key) => key.startsWith('@@token'),
        (value, key) => Promise.resolve(`${value}_@coorpacademy@learner`),
      ],
    };

    const goodProgression = createProgression({
      _id: 'successProgressionId',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'mod_1',
        type: CONTENT_TYPE.LEVEL,
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: 'suc_1',
        },
      },
    });

    AsyncStorage.getItem = jest.fn((key) => {
      if (key.startsWith('@@token')) return Promise.resolve('baseToken');
      if (key.startsWith('progression')) return Promise.resolve(JSON.stringify(goodProgression));
      if (key.startsWith('async_')) return Promise.resolve(2);
    });

    AsyncStorage.setItem = jest
      .fn()
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('@@token');
        expect(value).toEqual('baseToken_@coorpacademy');
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toBe('async_storage_version');
        expect(value).toEqual('3');
      });

    return expect(runMigrations(migrations)).rejects.toThrow(new Error('Something bad happened'));
  });

  afterEach(() => {
    jest.resetModules();
  });
});
