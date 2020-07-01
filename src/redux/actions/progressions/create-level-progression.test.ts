import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createLevel} from '../../../__fixtures__/levels';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'},
}));

describe('createLevelProgression', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  [
    {
      production: true,
      levelData: {ref: 'lev_1', chapterIds: []},
      version: '2',
      expectedEngineConfig: {livesDisabled: false, version: '2'},
    },
    {
      production: true,
      levelData: {ref: 'lev_1', chapterIds: []},
      expectedEngineConfig: {livesDisabled: false, version: 'latest'},
    },
    {
      production: true,
      version: '2',
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: true},
      expectedEngineConfig: {livesDisabled: false, version: '2'},
    },
    {
      production: true,
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: true},
      expectedEngineConfig: {livesDisabled: false, version: 'latest'},
    },
    {
      production: true,
      version: '2',
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: false},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: '2'},
    },
    {
      production: true,
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: false},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: 'latest'},
    },
    {
      production: false,
      levelData: {ref: 'lev_1', chapterIds: []},
      version: '2',
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: '2'},
    },
    {
      production: false,
      levelData: {ref: 'lev_1', chapterIds: []},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: 'latest'},
    },
    {
      production: false,
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: true},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: 'latest'},
    },
    {
      production: false,
      version: '2',
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: true},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: '2'},
    },
    {
      production: false,
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: false},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: 'latest'},
    },
    {
      production: false,
      version: '2',
      levelData: {ref: 'lev_1', chapterIds: [], shuffleChoices: false},
      expectedEngineConfig: {livesDisabled: false, shuffleChoices: false, version: '2'},
    },
  ].forEach((data) => {
    it(`should create level progression with ${
      data.version ? 'default' : 'specific'
    } engine version (with shuffleChoices ${
      data.levelData.shuffleChoices ? 'enabled' : 'disabled'
    }) in ${data.production ? 'production' : 'test'}`, async () => {
      if (data.production) {
        jest.mock('../../../modules/environment', () => ({
          __TEST__: false,
        }));
      } else {
        jest.mock('../../../modules/environment', () => ({
          __TEST__: true,
        }));
      }
      const playerStore = require('@coorpacademy/player-store');
      const {createLevelProgression} = require('./create-level-progression');

      const level = createLevel(data.levelData);

      const version = data.version || 'latest';

      // @ts-ignore
      playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
        expect(ObjectId.isValid(_id)).toBeTruthy();
        expect(engine).toEqual({ref: ENGINE.LEARNER, version});
        expect(content).toEqual({type: CONTENT_TYPE.LEVEL, ref: 'lev_1'});
        expect(engineConfig).toEqual(data.expectedEngineConfig);
        return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
      });

      const actual = data.version
        ? // @ts-ignore
          await createLevelProgression(level, version)
        : // @ts-ignore
          await createLevelProgression(level);

      expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
