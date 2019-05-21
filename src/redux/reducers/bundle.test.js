// @flow strict

import {CARD_TYPE} from '../../layer/data/_const';
import {FETCH_REQUEST, FETCH_SUCCESS} from '../actions/bundle';
import type {Action} from '../actions/bundle';
import reducer, {
  reducePendingContentStatus,
  reducePendingContent,
  reduceReadyContent,
  reduceReadyContentStatus
} from './bundle';
import type {State, OfflineStatus, OfflineContents} from './bundle';

describe('Bundle', () => {
  const expectedInitialState: State = {
    disciplines: {},
    chapters: {}
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe('reducePendingContentStatus', () => {
    it('Without prevStatus', () => {
      const expected: OfflineStatus = {
        pending: ['de', 'en'],
        ready: []
      };
      const result = reducePendingContentStatus(undefined, ['de', 'en']);
      expect(result).toEqual(expected);
    });

    it('With prevStatus', () => {
      const prevStatus: OfflineStatus = {
        pending: ['ja'],
        ready: ['en']
      };
      const expected: OfflineStatus = {
        pending: ['ja', 'de', 'en'],
        ready: []
      };
      const result = reducePendingContentStatus(prevStatus, ['de', 'en']);
      expect(result).toEqual(expected);
    });
  });

  it('reducePendingContent', () => {
    const prevState: OfflineContents = {
      dis1: {
        pending: [],
        ready: ['en']
      }
    };
    const content = {
      dis1: ['de']
    };
    const expected: OfflineContents = {
      dis1: {
        pending: ['de'],
        ready: ['en']
      }
    };
    const result = reducePendingContent(prevState, content);
    expect(result).toEqual(expected);
  });

  describe('reduceReadyContentStatus', () => {
    it('Without prevStatus', () => {
      const expected: OfflineStatus = {
        pending: [],
        ready: ['de', 'en']
      };
      const result = reduceReadyContentStatus(undefined, ['de', 'en']);
      expect(result).toEqual(expected);
    });

    it('With prevStatus', () => {
      const prevStatus: OfflineStatus = {
        pending: ['de', 'en', 'ja'],
        ready: ['pl']
      };
      const expected: OfflineStatus = {
        pending: ['ja'],
        ready: ['pl', 'de', 'en']
      };
      const result = reduceReadyContentStatus(prevStatus, ['de', 'en']);
      expect(result).toEqual(expected);
    });
  });

  it('reduceReadyContent', () => {
    const prevState: OfflineContents = {
      dis1: {
        pending: ['en'],
        ready: []
      }
    };
    const content = {
      dis1: ['en']
    };
    const expected: OfflineContents = {
      dis1: {
        pending: [],
        ready: ['en']
      }
    };
    const result = reduceReadyContent(prevState, content);
    expect(result).toEqual(expected);
  });

  describe(FETCH_REQUEST, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_REQUEST,
        payload: {
          type: CARD_TYPE.COURSE,
          ref: 'foobarbaz',
          languages: ['de', 'en']
        }
      };

      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        disciplines: {
          foobarbaz: {
            pending: ['de', 'en'],
            ready: []
          }
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_SUCCESS,
        payload: {
          disciplines: {
            foobarbaz: ['de', 'en']
          },
          chapters: {
            foobarbazqux: ['ja']
          }
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
        disciplines: {
          foobarbaz: {
            pending: [],
            ready: ['de', 'en']
          }
        },
        chapters: {
          foobarbazqux: {
            pending: [],
            ready: ['ja']
          }
        }
      };
      expect(result).toEqual(expected);
    });
  });
});
