// @flow strict

import {FETCH_REQUEST, FETCH_SUCCESS} from '../actions/discipline-bundle';
import type {Action} from '../actions/discipline-bundle';
import reducer, {
  reducePendingContentStatus,
  reducePendingContent,
  reduceReadyContent,
  reduceReadyContentStatus
} from './discipline-bundle';
import type {State, OfflineStatus, OfflineContents} from './discipline-bundle';

describe('Discipline bundle', () => {
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
        pending: ['de', 'fr'],
        ready: []
      };
      const result = reducePendingContentStatus(undefined, ['de', 'fr']);
      expect(result).toEqual(expected);
    });

    it('With prevStatus', () => {
      const prevStatus: OfflineStatus = {
        pending: ['ja'],
        ready: ['fr']
      };
      const expected: OfflineStatus = {
        pending: ['ja', 'de', 'fr'],
        ready: []
      };
      const result = reducePendingContentStatus(prevStatus, ['de', 'fr']);
      expect(result).toEqual(expected);
    });
  });

  it('reducePendingContent', () => {
    const prevState: OfflineContents = {
      dis1: {
        pending: [],
        ready: ['fr']
      }
    };
    const content = {
      dis1: ['de']
    };
    const expected: OfflineContents = {
      dis1: {
        pending: ['de'],
        ready: ['fr']
      }
    };
    const result = reducePendingContent(prevState, content);
    expect(result).toEqual(expected);
  });

  describe('reduceReadyContentStatus', () => {
    it('Without prevStatus', () => {
      const expected: OfflineStatus = {
        pending: [],
        ready: ['de', 'fr']
      };
      const result = reduceReadyContentStatus(undefined, ['de', 'fr']);
      expect(result).toEqual(expected);
    });

    it('With prevStatus', () => {
      const prevStatus: OfflineStatus = {
        pending: ['de', 'fr', 'ja'],
        ready: ['pl']
      };
      const expected: OfflineStatus = {
        pending: ['ja'],
        ready: ['pl', 'de', 'fr']
      };
      const result = reduceReadyContentStatus(prevStatus, ['de', 'fr']);
      expect(result).toEqual(expected);
    });
  });

  it('reduceReadyContent', () => {
    const prevState: OfflineContents = {
      dis1: {
        pending: ['fr'],
        ready: []
      }
    };
    const content = {
      dis1: ['fr']
    };
    const expected: OfflineContents = {
      dis1: {
        pending: [],
        ready: ['fr']
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

    it('Without payload', () => {
      const action = {
        type: FETCH_REQUEST
      };
      // $FlowFixMe this is to emulate an empty payload
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
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

    it('Without payload', () => {
      const action = {
        type: FETCH_SUCCESS
      };
      // $FlowFixMe this is to emulate an empty payload
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
    });
  });
});
