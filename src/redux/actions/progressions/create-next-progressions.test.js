// @flow strict
import {ObjectId} from 'bson';
import {CONTENT_TYPE, ENGINE} from '../../../const';

import {createChapter} from '../../../__fixtures__/chapters';
import {createLevel} from '../../../__fixtures__/levels';
import {CREATE_NEXT_SUCCESS, createNextProgression} from './create-next-progression';

const playerStore = require('@coorpacademy/player-store');

const chapter = createChapter({
  ref: 'cha1',
  name: 'chapter1'
});

const level = createLevel({
  ref: 'lvl1',
  chapterIds: ['bar', 'baz'],
  name: 'level1'
});

const getMockedContent = contentType => {
  switch (contentType) {
    case CONTENT_TYPE.LEVEL:
      return level;
    case CONTENT_TYPE.CHAPTER:
      return chapter;
    default:
      return Promise.resolve();
  }
};

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  selectProgression: jest.fn(),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

describe('Create next Progression', () => {
  [CONTENT_TYPE.CHAPTER, CONTENT_TYPE.LEVEL].map(contentType =>
    it(`should create a new progression | ${contentType}`, async () => {
      const mockedContent = getMockedContent(contentType);
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Content: {
            find: jest.fn().mockImplementationOnce(type => {
              expect(type).toEqual(contentType);
              return mockedContent;
            })
          },
          Progressions: {
            findLast: jest.fn().mockImplementationOnce((type, ref) => {
              if (contentType === CONTENT_TYPE.CHAPTER) {
                expect(type).toEqual(ENGINE.MICROLEARNING);
              }
              if (contentType === CONTENT_TYPE.LEVEL) {
                expect(type).toEqual(ENGINE.LEARNER);
              }
              // $FlowFixMe
              expect(ref).toEqual(mockedContent.universalRef);
              return Promise.resolve(null);
            })
          }
        }
      };

      // $FlowFixMe
      playerStore.createProgression.mockImplementationOnce(
        (_id, engine, _content, engineConfig) => {
          expect(ObjectId.isValid(_id)).toBeTruthy();
          expect(_content.type).toEqual(contentType);
          // $FlowFixMe
          expect(_content.ref).toEqual(mockedContent.universalRef);
          if (contentType === CONTENT_TYPE.CHAPTER) {
            // $FlowFixMe
            expect(engine).toEqual({ref: ENGINE.MICROLEARNING, version: '1'});
            expect(engineConfig).toEqual({version: '1'});
          }
          if (contentType === CONTENT_TYPE.LEVEL) {
            expect(engine).toEqual({ref: ENGINE.LEARNER, version: '2'});
            expect(engineConfig).toEqual({version: '2', livesDisabled: false});
          }
          return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
        }
      );

      // $FlowFixMe
      playerStore.selectProgression.mockImplementationOnce(id => {
        expect(id).toEqual('__ID__');
        return {type: '@@mock/SELECT_PROGRESSION', meta: {id}};
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/CREATE_NEXT_REQUEST',
          // $FlowFixMe
          meta: {type: contentType, ref: mockedContent.universalRef}
        });
        return action;
      });

      dispatch.mockImplementationOnce(async action => {
        expect(await action).toEqual({
          type: '@@mock/CREATE_PROGRESSION',
          payload: {
            _id: '__ID__'
          }
        });
        // $FlowFixMe
        return action;
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({type: '@@mock/SELECT_PROGRESSION', meta: {id: '__ID__'}});
        return action;
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: CREATE_NEXT_SUCCESS,
          // $FlowFixMe
          meta: {type: contentType, ref: mockedContent.universalRef}
        });
        return action;
      });

      // $FlowFixMe
      const result = await createNextProgression(contentType, mockedContent.universalRef)(
        // $FlowFixMe
        dispatch,
        getState,
        // $FlowFixMe
        options
      );

      return expect(result).toEqual({
        type: CREATE_NEXT_SUCCESS,
        // $FlowFixMe
        meta: {type: contentType, ref: mockedContent.universalRef}
      });
    })
  );

  it('should fail creating a progression of unknow type', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const options = {
      services: {}
    };

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual({
        type: '@@progression/CREATE_NEXT_REQUEST',
        // $FlowFixMe
        meta: {type: 'plop', ref: 'plup'}
      });
      return action;
    });

    const error = {
      type: '@@progression/CREATE_NEXT_FAILURE',
      error: true,
      meta: {
        ref: 'plup',
        type: 'plop'
      },
      payload: new Error('content type plop is not handled')
    };
    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual(error);
      // $FlowFixMe
      return action;
    });

    // $FlowFixMe
    const result = await createNextProgression('plop', 'plup')(
      // $FlowFixMe
      dispatch,
      getState,
      // $FlowFixMe
      options
    );

    return expect(result).toEqual(error);
  });

  it('should continue last progression if not finished yet', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const options = {
      services: {
        Content: {
          find: jest.fn().mockImplementationOnce(type => {
            expect(type).toEqual(CONTENT_TYPE.CHAPTER);
            return chapter;
          })
        },
        Progressions: {
          findLast: jest.fn().mockImplementationOnce((type, ref) => {
            expect(type).toEqual(ENGINE.MICROLEARNING);
            // $FlowFixMe
            expect(ref).toEqual(chapter.universalRef);
            return Promise.resolve({_id: '__LAST__'});
          })
        }
      }
    };

    // $FlowFixMe
    playerStore.selectProgression.mockImplementationOnce(id => {
      expect(id).toEqual('__LAST__');
      return {type: '@@mock/SELECT_PROGRESSION', meta: {id}};
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual({
        type: '@@progression/CREATE_NEXT_REQUEST',
        // $FlowFixMe
        meta: {type: CONTENT_TYPE.CHAPTER, ref: chapter.universalRef}
      });
      return action;
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual({type: '@@mock/SELECT_PROGRESSION', meta: {id: '__LAST__'}});
      return action;
    });

    // $FlowFixMe
    const result = await createNextProgression(CONTENT_TYPE.CHAPTER, chapter.universalRef)(
      // $FlowFixMe
      dispatch,
      getState,
      // $FlowFixMe
      options
    );

    return expect(result).toEqual({type: '@@mock/SELECT_PROGRESSION', meta: {id: '__LAST__'}});
  });
});
