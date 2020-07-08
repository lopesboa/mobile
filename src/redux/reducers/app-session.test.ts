import {SAVE_INCREMENT} from '../actions/app-session';
import {SIGN_OUT} from '../actions/authentication';
import type {Action} from '../actions/app-session';
import reducer from './app-session';
import type {State} from './app-session';

describe('App Session', () => {
  const expectedInitialState: State = 0;
  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  it(SIGN_OUT, () => {
    const action = {
      type: SIGN_OUT,
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(4, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(SAVE_INCREMENT, () => {
    it('Default', () => {
      const action: Action = {
        type: SAVE_INCREMENT,
        payload: 1,
      };
      const result = reducer(undefined, action);
      const expected: State = 1;
      expect(result).toEqual(expected);
    });
  });
});
