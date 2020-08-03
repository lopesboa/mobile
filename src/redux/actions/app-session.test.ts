import {SAVE_INCREMENT, increment} from './app-session';
import type {Action} from './app-session';

describe('App Session', () => {
  describe('Increment', () => {
    it('defaults to 0 if appSession is null and increments it', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn(() => ({appSession: null}));
      const expected: Action = {
        type: SAVE_INCREMENT,
        payload: 1,
      };
      // @ts-ignore missing callable signature
      await increment()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
    it('increments the number of session', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn(() => ({appSession: 1}));
      const expected: Action = {
        type: SAVE_INCREMENT,
        payload: 2,
      };
      // @ts-ignore missing callable signature
      await increment()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
