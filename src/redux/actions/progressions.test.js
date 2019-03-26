// @flow strict

import {ObjectId} from 'bson';
import {ENGINE, CONTENT_TYPE} from '../../const';
import {createProgression} from '../../__fixtures__/progression';
import {createChapter} from '../../__fixtures__/chapters';
import {createLevel} from '../../__fixtures__/levels';
import {
  synchronizeProgressions,
  synchronizeProgression,
  createChapterProgression,
  createLevelProgression,
  selectProgression
} from './progression';

jest.mock('@coorpacademy/player-store', () => ({
  createProgression: jest.fn(),
  selectProgression: jest.fn(id =>
    Promise.resolve({type: '@@mock/SELECT_PROGRESSION', payload: {id}})
  ),
  CONTENT_TYPE: {CHAPTER: 'chapter', LEVEL: 'level'}
}));

const playerStore = require('@coorpacademy/player-store');

describe('Progressions actions', () => {
  const inProgressProgression = createProgression({
    _id: 'inProgressProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: 'sli_1'
      }
    }
  });
  const successProgression = createProgression({
    _id: 'successProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.SUCCESS,
        ref: 'suc_1'
      }
    }
  });
  const failureProgression = createProgression({
    _id: 'failureProgressionId',
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1'
      }
    }
  });
  const wihoutIdProgression = createProgression({
    engine: ENGINE.LEARNER,
    progressionContent: {
      ref: 'mod_1',
      type: CONTENT_TYPE.LEVEL
    },
    state: {
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: 'fai_1'
      }
    }
  });
  describe('synchronizeProgressions', () => {
    it('should synchronize only finished progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([
          inProgressProgression,
          successProgression,
          failureProgression,
          wihoutIdProgression
        ])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(actual).toBeUndefined();
    });
    it('should skip inProgress progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([inProgressProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(actual).toBeUndefined();
    });
    it('should skip progression without _id', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([wihoutIdProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(0);
      expect(actual).toBeUndefined();
    });
    it('should synchronize successed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([successProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });
    it('should synchronize failed progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          getAll: jest.fn()
        }
      };

      store.dispatch.mockImplementation(action => {
        expect(action).toBeInstanceOf(Function);
        return Promise.resolve(action);
      });

      services.Progressions.getAll.mockImplementationOnce(() =>
        Promise.resolve([failureProgression])
      );

      // $FlowFixMe
      const actual = await synchronizeProgressions(store.dispatch, store.getState, {services});

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(actual).toBeUndefined();
    });
  });
  describe('synchronizeProgression', () => {
    it('should synchronize progression', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_SUCCESS',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve(successProgression);
      });

      services.Progressions.synchronize.mockImplementationOnce(progression => {
        expect(progression).toBe(successProgression);
        return Promise.resolve(progression);
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_SUCCESS',
        meta: {id: successProgression._id}
      });
    });
    it("should fail if progression doesn't exist", async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_SUCCESS',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve();
      });

      services.Progressions.synchronize.mockImplementationOnce(progression => {
        expect(progression).toBe(successProgression);
        return Promise.resolve(progression);
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(0);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_SUCCESS',
        meta: {id: successProgression._id}
      });
    });
    it('should fail if synchronization failed', async () => {
      const store = {
        getState: jest.fn(),
        dispatch: jest.fn()
      };

      const services = {
        Progressions: {
          findById: jest.fn(),
          synchronize: jest.fn()
        }
      };

      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_REQUEST',
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });
      store.dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: '@@progression/SYNCHRONIZE_FAILURE',
          error: true,
          payload: new Error('Synchronization failed'),
          meta: {id: successProgression._id}
        });
        return Promise.resolve(action);
      });

      services.Progressions.findById.mockImplementationOnce(id => {
        expect(id).toBe(successProgression._id);
        return Promise.resolve(successProgression);
      });

      services.Progressions.synchronize.mockImplementationOnce(progression => {
        expect(progression).toBe(successProgression);
        return Promise.reject(new Error('Synchronization failed'));
      });

      // $FlowFixMe
      const actual = await synchronizeProgression(successProgression._id)(
        // $FlowFixMe
        store.dispatch,
        store.getState,
        // $FlowFixMe
        {services}
      );
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(services.Progressions.synchronize).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({
        type: '@@progression/SYNCHRONIZE_FAILURE',
        error: true,
        payload: new Error('Synchronization failed'),
        meta: {id: successProgression._id}
      });
    });
  });

  describe('createProgression', () => {
    it('createChapterProgression', async () => {
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
    it('createLevelProgression', async () => {
      const level = createLevel({
        ref: 'lev_1',
        chapterIds: []
      });

      // $FlowFixMe
      playerStore.createProgression.mockImplementationOnce((_id, engine, content, engineConfig) => {
        expect(ObjectId.isValid(_id)).toBeTruthy();
        expect(engine).toEqual({ref: ENGINE.LEARNER, version: '1'});
        expect(content).toEqual({type: CONTENT_TYPE.LEVEL, ref: 'lev_1'});
        expect(engineConfig).toEqual({livesDisabled: false, version: '1'});
        return {type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}};
      });

      // $FlowFixMe
      const actual = await createLevelProgression(level);

      expect(playerStore.createProgression).toHaveBeenCalledTimes(1);
      expect(actual).toEqual({type: '@@mock/CREATE_PROGRESSION', payload: {_id: '__ID__'}});
    });
    afterEach(() => {
      // $FlowFixMe
      playerStore.createProgression.mockReset();
    });
    afterEach(() => {
      // $FlowFixMe
      playerStore.createProgression.mockReset();
    });
  });

  it('selectProgression', async () => {
    expect(await selectProgression('foo')).toEqual({
      type: '@@mock/SELECT_PROGRESSION',
      payload: {id: 'foo'}
    });
  });
});
