import {SIGN_OUT, SIGN_IN_SUCCESS} from '../../actions/authentication';
import type {Action} from '../../actions/authentication';
import reducer, {initialState as tokenInitialState} from './token';
import type {State} from './token';

describe('Authentification', () => {
  const expectedInitialState: State = tokenInitialState;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(SIGN_IN_SUCCESS, () => {
    it('Default', () => {
      const payload = 'fakeToken';
      const action: Action = {type: SIGN_IN_SUCCESS, payload};
      const result = reducer(undefined, action);
      const expected: State = payload;
      expect(result).toEqual(expected);
    });
  });
  describe(SIGN_OUT, () => {
    it('Default', () => {
      const action: Action = {type: SIGN_OUT};
      const result = reducer(undefined, action);
      const expected: State = expectedInitialState;
      expect(result).toEqual(expected);
    });
  });
});
