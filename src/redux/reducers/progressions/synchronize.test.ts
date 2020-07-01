import {
  SYNCHRONIZE_ALL_REQUEST,
  SYNCHRONIZE_ALL_SUCCESS,
  SYNCHRONIZE_ALL_FAILURE,
} from '../../actions/progressions/synchronize';
import type {AllAction as Action} from '../../actions/progressions/synchronize';
import reducer from './synchronize';
import type {State} from './synchronize';

describe('Synchronizes', () => {
  const expectedInitialState: State = {
    isSynchronizing: false,
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe('SYNCHRONIZE_ALL_REQUEST', () => {
    it('Default', () => {
      const payload = true;
      const action: Action = {
        type: SYNCHRONIZE_ALL_REQUEST,
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        isSynchronizing: payload,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('SYNCHRONIZE_ALL_SUCCESS', () => {
    it('Default', () => {
      const payload = false;
      const action: Action = {
        type: SYNCHRONIZE_ALL_SUCCESS,
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        isSynchronizing: payload,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('SYNCHRONIZE_ALL_FAILURE', () => {
    it('Default', () => {
      const payload = false;
      const action: Action = {
        type: SYNCHRONIZE_ALL_FAILURE,
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        isSynchronizing: payload,
      };

      expect(result).toEqual(expected);
    });
  });
});
