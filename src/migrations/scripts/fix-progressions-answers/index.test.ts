import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createProgression} from '../../../__fixtures__/progression';
import type {Migrations} from '../../types';

describe('Migration - Progressions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not migrate if predite returns false', async () => {
    const AsyncStorage = require('@react-native-community/async-storage');
    const {runMigrations} = require('../../runner');
    const fixProgressionsAnswers = require('.');

    const migrations: Migrations = {
      '2': [fixProgressionsAnswers.predicate, fixProgressionsAnswers.transformer],
    };

    AsyncStorage.getAllKeys = jest.fn(() => Promise.resolve(['@@token']));

    AsyncStorage.getItem = jest.fn((key) => {
      if (key.startsWith('@@token')) return Promise.resolve('baseToken');
      if (key.startsWith('async_')) return Promise.resolve(1);
    });

    AsyncStorage.setItem.mockImplementationOnce((key: string, value: string) => {
      expect(key).toEqual('async_storage_version');
      expect(value).toEqual('2');
    });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should only migrate bad progressions', async () => {
    const AsyncStorage = require('@react-native-community/async-storage');
    const {runMigrations} = require('../../runner');
    const fixProgressionsAnswers = require('.');

    const migrations: Migrations = {
      '2': [fixProgressionsAnswers.predicate, fixProgressionsAnswers.transformer],
    };

    AsyncStorage.getAllKeys = jest.fn(() =>
      Promise.resolve(['progression_badProgressionId', 'progression_goodProgressionId']),
    );
    // @ts-ignore
    const badProgression = createProgression({
      _id: 'badProgressionId',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'mod_1',
        type: CONTENT_TYPE.LEVEL,
      },
      actions: [
        {
          type: 'move',
          payload: {
            instructions: null,
            nextContent: {
              type: 'slide',
              ref: '10.A4.5',
            },
          },
          createdAt: '2019-11-27T14:32:06.904Z',
        },
        {
          type: 'answer',
          payload: {
            answer: [['Walmart'], ['Heyy']],
          },
        },
        {
          type: 'answer',
          payload: {
            answer: [['YEAHTHATSANOTHERONE ']],
          },
        },
      ],
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_1',
        },
        allAnswers: [
          {
            slideRef: '10.A4.5',
            isCorrect: false,
            answer: [['Walmart'], ['Heyy']],
          },
          {
            slideRef: 'sli_N1UJlqIzf',
            isCorrect: false,
            answer: [['YEAHTHATSANOTHERONE ']],
          },
        ],
      },
    });
    // @ts-ignore
    const goodProgression = createProgression({
      _id: 'goodProgressionId',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'mod_1',
        type: CONTENT_TYPE.LEVEL,
      },
      actions: [
        {
          type: 'move',
          payload: {
            instructions: null,
            nextContent: {
              type: 'slide',
              ref: '10.A4.5',
            },
          },
          createdAt: '2019-11-27T14:32:06.904Z',
        },
        {
          type: 'answer',
          payload: {
            answer: ['Walmart', 'Good'],
          },
        },
        {
          type: 'answer',
          payload: {
            answer: ['Good Response'],
          },
        },
      ],
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_1',
        },
        allAnswers: [
          {
            slideRef: '10.A4.5',
            isCorrect: false,
            answer: ['Walmart', 'Good'],
          },
          {
            slideRef: 'sli_N1UJlqIzf',
            isCorrect: false,
            answer: ['Good Response'],
          },
        ],
      },
    });

    // @ts-ignore
    const fixedBadProgression = createProgression({
      _id: 'badProgressionId',
      engine: ENGINE.LEARNER,
      progressionContent: {
        ref: 'mod_1',
        type: CONTENT_TYPE.LEVEL,
      },
      actions: [
        {
          type: 'move',
          payload: {
            instructions: null,
            nextContent: {
              type: 'slide',
              ref: '10.A4.5',
            },
          },
          createdAt: '2019-11-27T14:32:06.904Z',
        },
        {
          type: 'answer',
          payload: {
            answer: ['Walmart', 'Heyy'],
          },
        },
        {
          type: 'answer',
          payload: {
            answer: ['YEAHTHATSANOTHERONE '],
          },
        },
      ],
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_1',
        },
        allAnswers: [
          {
            slideRef: '10.A4.5',
            isCorrect: false,
            answer: ['Walmart', 'Heyy'],
          },
          {
            slideRef: 'sli_N1UJlqIzf',
            isCorrect: false,
            answer: ['YEAHTHATSANOTHERONE '],
          },
        ],
      },
    });

    AsyncStorage.getItem = jest.fn((key) => {
      if (key.endsWith('badProgressionId')) return Promise.resolve(JSON.stringify(badProgression));
      if (key.endsWith('goodProgressionId'))
        return Promise.resolve(JSON.stringify(goodProgression));
      if (key.startsWith('async_')) return Promise.resolve(1);
    });

    AsyncStorage.setItem
      .mockImplementationOnce((key, value) => {
        expect(key).toEqual('progression_badProgressionId');
        expect(value).toEqual(JSON.stringify(fixedBadProgression));
      })
      .mockImplementationOnce((key, value) => {
        expect(key).toEqual('async_storage_version');
        expect(value).toEqual('2');
      });

    await runMigrations(migrations);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
  });
});
