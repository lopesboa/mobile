// @flow strict

import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createChapter} from '../../../__fixtures__/chapters';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

describe('createChapterProgression', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should create chapter progression with specific engine version', async () => {
    const playerStore = require('@coorpacademy/player-store');
    const {createChapterProgression} = require('./create-chapter-progression');

    const chapter = createChapter({
      ref: 'cha_1',
      name: 'chapter'
    });

    const version = '2';

    // $FlowFixMe
    playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
      expect(ObjectId.isValid(_id)).toBeTruthy();
      expect(engine).toEqual({ref: ENGINE.MICROLEARNING, version});
      expect(content).toEqual({type: CONTENT_TYPE.CHAPTER, ref: 'cha_1'});
      expect(engineConfig).toEqual({version});
      return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
    });

    // $FlowFixMe
    const actual = await createChapterProgression(chapter, version);

    expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
    expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
  });

  it('should create chapter progression with default engine version', async () => {
    const playerStore = require('@coorpacademy/player-store');
    const {createChapterProgression} = require('./create-chapter-progression');

    const chapter = createChapter({
      ref: 'cha_1',
      name: 'chapter'
    });

    // $FlowFixMe
    playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
      expect(ObjectId.isValid(_id)).toBeTruthy();
      expect(engine).toEqual({ref: ENGINE.MICROLEARNING, version: 'latest'});
      expect(content).toEqual({type: CONTENT_TYPE.CHAPTER, ref: 'cha_1'});
      expect(engineConfig).toEqual({version: 'latest'});
      return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
    });

    // $FlowFixMe
    const actual = await createChapterProgression(chapter);

    expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
    expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
