import {INCREMENT, increment} from './app-session';
import type {Action} from './app-session';

describe('App Session', () => {
  describe('Increment', () => {
    it('increments the number of session', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn();
      const expected: Action = {
        type: INCREMENT
      };
      // @ts-ignore missing callable signature
      await increment()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
