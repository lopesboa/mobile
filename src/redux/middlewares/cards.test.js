// @flow strict

import {createDisciplineCard, createChapterCard, createCardLevel} from '../../__fixtures__/cards';
import {createChapter} from '../../__fixtures__/chapters';
import {createLevel} from '../../__fixtures__/levels';
import {
  FETCH_REQUEST,
  SELECT_CARD,
  SELECT_CARD_FAILURE,
  FETCH_SUCCESS,
  FETCH_ERROR
} from '../actions/cards';
import type {
  Action,
  FetchRequestPayload,
  FetchSuccessPayload,
  FetchErrorPayload,
  SelectCardPayload,
  SelectCardFailurePayload
} from '../actions/cards';
import type {Options} from '../_types';
import {CARD_STATUS} from '../../layer/data/_const';
import {sleep} from '../../utils/tests';
import createMiddleware from './cards';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [],
  title: 'Discipline'
});
const chapterCard = createChapterCard({
  ref: 'cha1',
  completion: 0,
  status: CARD_STATUS.ACTIVE,
  title: 'Chapter'
});
const items = [disciplineCard, chapterCard];

jest.mock('../actions/progression', () => ({
  createLevelProgression: jest.fn(() => ({type: '@@mock/CREATE_LEVEL_PROGRESSION'})),
  createChapterProgression: jest.fn(() => ({type: '@@mock/CREATE_CHAPTER_PROGRESSION'}))
}));

jest.mock('../actions/discipline-bundle', () => ({
  fetchRequest: jest.fn((ref, language) => ({
    type: '@@mock/FETCH_DISCIPLINE_BUNDLE',
    payload: {
      ref,
      language
    }
  }))
}));

describe('Cards', () => {
  const options: Options = {
    // $FlowFixMe we dont want to mock the entire services object
    services: {
      Cards: {
        find: jest.fn(() => Promise.reject(new Error('Fake error')))
      },
      // $FlowFixMe we dont want to mock the entire services object
      Content: {
        find: jest.fn(() => Promise.reject(new Error('Fake error')))
      }
    }
  };

  it('shoud not handle unsupported action', () => {
    const action = {
      type: 'FOO'
    };
    const middleware = createMiddleware(options);
    const store = createStore();
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  describe(FETCH_REQUEST, () => {
    const payload: FetchRequestPayload = {
      language: 'en'
    };
    const action: Action = {
      type: FETCH_REQUEST,
      payload
    };

    it('should handle empty payload', async () => {
      const emptyAction = {
        type: FETCH_REQUEST
      };
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      // $FlowFixMe this si to test only
      middleware(store)(next)(emptyAction);
      await sleep();
      const expectedPayload: FetchErrorPayload = {
        error: 'Invalid payload'
      };
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(emptyAction);
    });

    it('should handle find rejection', async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedPayload: FetchErrorPayload = {
        error: 'Error: Fake error'
      };
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should fetch cards', async () => {
      // $FlowFixMe we dont want to mock the entire services object
      const extendedOptions: Options = {
        services: {
          Cards: {
            ...options.services.Cards,
            find: jest.fn(() => Promise.resolve(items))
          }
        }
      };
      const middleware = createMiddleware(extendedOptions);
      const store = createStore();
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedPayload: FetchSuccessPayload = {
        items,
        language: 'en'
      };
      const expectedAction: Action = {
        type: FETCH_SUCCESS,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });
  });

  describe(FETCH_SUCCESS, () => {
    const payload: FetchSuccessPayload = {
      items,
      language: 'en'
    };
    const action: Action = {
      type: FETCH_SUCCESS,
      payload
    };

    it('should handle empty payload', async () => {
      const emptyAction = {
        type: FETCH_SUCCESS
      };
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      // $FlowFixMe this si to test only
      middleware(store)(next)(emptyAction);
      await sleep();
      const expectedPayload: SelectCardFailurePayload = {
        error: 'Invalid success payload'
      };
      const expectedAction: Action = {
        type: FETCH_ERROR,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(emptyAction);
    });

    it('should trigger discipline bundle fetch', async () => {
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      middleware(store)(next)(action);
      await sleep();
      const expectedAction = {
        type: '@@mock/FETCH_DISCIPLINE_BUNDLE',
        payload: {
          ref: 'dis1',
          language: ['en']
        }
      };
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });
  });

  describe(SELECT_CARD, () => {
    it('should handle empty payload', async () => {
      const action = {
        type: SELECT_CARD
      };
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      // $FlowFixMe this si to test only
      middleware(store)(next)(action);
      await sleep();
      const expectedPayload: SelectCardFailurePayload = {
        error: 'Invalid payload'
      };
      const expectedAction: Action = {
        type: SELECT_CARD_FAILURE,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should handle unsupported card type', async () => {
      const payload: SelectCardPayload = {
        // $FlowFixMe we dont want to mock the entire object
        item: {
          type: 'foobarbaz'
        }
      };
      const action = {
        type: SELECT_CARD,
        payload
      };
      const middleware = createMiddleware(options);
      const store = createStore();
      const next = jest.fn();
      // $FlowFixMe this si to test only
      middleware(store)(next)(action);
      await sleep();
      const expectedPayload: SelectCardFailurePayload = {
        // $FlowFixMe we dont want to mock the entire object
        item: {
          type: 'foobarbaz'
        },
        error: 'Unsupported card type'
      };
      const expectedAction: Action = {
        type: SELECT_CARD_FAILURE,
        payload: expectedPayload
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('Course', () => {
      const payload: SelectCardPayload = {
        item: disciplineCard
      };
      const action: Action = {
        type: SELECT_CARD,
        payload
      };

      it('should handle no level', async () => {
        const middleware = createMiddleware(options);
        const store = createStore();
        const next = jest.fn();
        middleware(store)(next)(action);
        await sleep();
        const expectedPayload: SelectCardFailurePayload = {
          ...payload,
          error: 'Course has no level'
        };
        const expectedAction: Action = {
          type: SELECT_CARD_FAILURE,
          payload: expectedPayload
        };
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
        expect(next).toHaveBeenCalledWith(action);
      });

      it('should handle content find rejection', async () => {
        const middleware = createMiddleware(options);
        const store = createStore();
        const next = jest.fn();
        middleware(store)(next)(action);
        await sleep();
        const expectedPayload: SelectCardFailurePayload = {
          ...payload,
          error: 'Level progression not created'
        };
        const expectedAction: Action = {
          type: SELECT_CARD_FAILURE,
          payload: expectedPayload
        };
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
        expect(next).toHaveBeenCalledWith(action);
      });

      it('should create progression', async () => {
        const level = createLevel({ref: 'mod1', chapterIds: []});
        const extendedAction: Action = {
          type: SELECT_CARD,
          payload: {
            item: createDisciplineCard({
              ref: 'dis2',
              completion: 0,
              levels: [
                createCardLevel({ref: 'mod1', status: CARD_STATUS.ACTIVE, label: 'Fake level'})
              ],
              title: 'Discipline'
            })
          }
        };
        // $FlowFixMe we dont want to mock the entire object
        const extendedOptions: Options = {
          ...options,
          services: {
            Content: {
              find: jest.fn(() => Promise.resolve(level))
            }
          }
        };
        const middleware = createMiddleware(extendedOptions);
        const store = createStore();
        const next = jest.fn();
        middleware(store)(next)(extendedAction);
        await sleep();
        const expectedAction = {
          type: '@@mock/CREATE_LEVEL_PROGRESSION'
        };
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
        expect(next).toHaveBeenCalledWith(extendedAction);
      });
    });

    describe('Chapter', () => {
      const payload: SelectCardPayload = {
        item: chapterCard
      };
      const action: Action = {
        type: SELECT_CARD,
        payload
      };

      it('should handle content find rejection', async () => {
        const middleware = createMiddleware(options);
        const store = createStore();
        const next = jest.fn();
        middleware(store)(next)(action);
        await sleep();
        const expectedPayload: SelectCardFailurePayload = {
          ...payload,
          error: 'Chapter progression not created'
        };
        const expectedAction: Action = {
          type: SELECT_CARD_FAILURE,
          payload: expectedPayload
        };
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
        expect(next).toHaveBeenCalledWith(action);
      });

      it('should create progression', async () => {
        const chapter = createChapter({ref: 'cha1', name: 'Fake chapter'});
        // $FlowFixMe we dont want to mock the entire object
        const extendedOptions: Options = {
          ...options,
          services: {
            Content: {
              find: jest.fn(() => Promise.resolve(chapter))
            }
          }
        };
        const middleware = createMiddleware(extendedOptions);
        const store = createStore();
        const next = jest.fn();
        middleware(store)(next)(action);
        await sleep();
        const expectedAction = {
          type: '@@mock/CREATE_CHAPTER_PROGRESSION'
        };
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
        expect(next).toHaveBeenCalledWith(action);
      });
    });
  });
});
