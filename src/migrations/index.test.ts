import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';

describe('Migrations', () => {
  it('should run all available migrations', async () => {
    const {migrationsRunner} = require('.');
    const AsyncStorage = require('@react-native-community/async-storage');

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
      if (key.startsWith('progression')) return Promise.resolve(JSON.stringify(goodProgression));
      if (key.startsWith('async_')) return Promise.resolve(1);
    });

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve([
        'card:en:dis_NJ9KIQ0F~j',
        'card:en:mod_Vkb8j0-nP',
        '@@token',
        'progression_5dee52c8a7da3a8443ed7a3a',
      ]),
    );

    AsyncStorage.setItem = jest.fn().mockImplementationOnce((key, value) => {
      expect(key).toBe('async_storage_version');
      expect(value).toEqual('2');
    });

    await migrationsRunner();
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetModules();
  });
});
