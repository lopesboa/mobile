import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createChapter} from '../../../__fixtures__/chapters';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'},
}));

describe('createChapterProgression', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  [
    {production: true, version: '2', expectedEngineConfig: {version: '2'}},
    {production: true, expectedEngineConfig: {version: 'latest'}},
    {production: false, version: '2', expectedEngineConfig: {version: '2', shuffleChoices: false}},
    {production: false, expectedEngineConfig: {version: 'latest', shuffleChoices: false}},
  ].forEach((data) => {
    it(`should create chapter progression with ${
      data.version ? 'default' : 'specific'
    } engine version in ${data.production ? 'production' : 'test'}`, async () => {
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
      const {createChapterProgression} = require('./create-chapter-progression');

      const chapter = createChapter({
        ref: 'cha_1',
        name: 'chapter',
      });

      const version = data.version || 'latest';

      // @ts-ignore
      playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
        expect(ObjectId.isValid(_id)).toBeTruthy();
        expect(engine).toEqual({ref: ENGINE.MICROLEARNING, version});
        expect(content).toEqual({type: CONTENT_TYPE.CHAPTER, ref: 'cha_1'});
        expect(engineConfig).toEqual(data.expectedEngineConfig);
        return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
      });

      const actual = data.version
        ? // @ts-ignore
          await createChapterProgression(chapter, version)
        : // @ts-ignore
          await createChapterProgression(chapter);

      expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
