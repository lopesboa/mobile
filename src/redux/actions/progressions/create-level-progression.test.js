// @flow strict

import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createLevel} from '../../../__fixtures__/levels';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

describe('createLevelProgression', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should create level progression with specific engine version', async () => {
    const playerStore = require('@coorpacademy/player-store');
    const {createLevelProgression} = require('./create-level-progression');

    const level = createLevel({
      ref: 'lev_1',
      chapterIds: []
    });

    const version = '2';

    // $FlowFixMe
    playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
      expect(ObjectId.isValid(_id)).toBeTruthy();
      expect(engine).toEqual({ref: ENGINE.LEARNER, version});
      expect(content).toEqual({type: CONTENT_TYPE.LEVEL, ref: 'lev_1'});
      expect(engineConfig).toEqual({livesDisabled: false, version});
      return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
    });

    // $FlowFixMe
    const actual = await createLevelProgression(level, version);

    expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
    expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
  });

  it('should create level progression with specific engine version', async () => {
    const playerStore = require('@coorpacademy/player-store');
    const {createLevelProgression} = require('./create-level-progression');

    const level = createLevel({
      ref: 'lev_1',
      chapterIds: []
    });

    // $FlowFixMe
    playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
      expect(ObjectId.isValid(_id)).toBeTruthy();
      expect(engine).toEqual({ref: ENGINE.LEARNER, version: 'latest'});
      expect(content).toEqual({type: CONTENT_TYPE.LEVEL, ref: 'lev_1'});
      expect(engineConfig).toEqual({livesDisabled: false, version: 'latest'});
      return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
    });

    // $FlowFixMe
    const actual = await createLevelProgression(level);

    expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
    expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
