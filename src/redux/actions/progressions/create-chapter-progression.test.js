// @flow strict

import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../../const';
import {createChapter} from '../../../__fixtures__/chapters';
import {createChapterProgression} from './create-chapter-progression';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

const playerStore = require('@coorpacademy/player-store');

describe('createChapterProgression', () => {
  it('should createChapterProgression', async () => {
    const chapter = createChapter({
      ref: 'cha_1',
      name: 'chapter'
    });

    // $FlowFixMe
    playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
      expect(ObjectId.isValid(_id)).toBeTruthy();
      expect(engine).toEqual({ref: ENGINE.MICROLEARNING, version: '1'});
      expect(content).toEqual({type: CONTENT_TYPE.CHAPTER, ref: 'cha_1'});
      expect(engineConfig).toEqual({version: '1'});
      return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
    });

    // $FlowFixMe
    const actual = await createChapterProgression(chapter);

    expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
    expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
  });
});
