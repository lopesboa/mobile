import type {Action, State} from '.';
import reducer, {increment, ACTION_NAME} from '.';

describe('AppSession', () => {
  describe('reducer', () => {
    const expectedInitialState: State = 0;

    it('returns the default state if we pass an invalid action', () => {
      const action = {
        type: 'FAKE_ACTION',
      };
      // @ts-ignore we are trying to emulate something else
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
    });

    it('returns the new state if we pass a valid action', () => {
      const action: Action = {
        type: ACTION_NAME,
        payload: 1,
      };
      const result = reducer(undefined, action);
      const expected: State = 1;
      expect(result).toEqual(expected);
    });
  });

  describe('action', () => {
    it('defaults to 0 if appSession is null and increments it', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({appSession: null}));
      const expected: Action = {
        type: ACTION_NAME,
        payload: 1,
      };
      // @ts-ignore missing callable signature
      await increment()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
    it('increments the number of session', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({appSession: 1}));
      const expected: Action = {
        type: ACTION_NAME,
        payload: 2,
      };
      // @ts-ignore missing callable signature
      await increment()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
