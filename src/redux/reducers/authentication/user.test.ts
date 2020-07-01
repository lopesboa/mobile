import {createUser} from '../../../__fixtures__/user';
import {FETCH_SUCCESS, fetchSuccess} from '../../actions/user';
import {SIGN_OUT} from '../../actions/authentication';
import type {Action} from '../../actions/user';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import reducer from './user';
import type {State} from './user';

describe('User', () => {
  const expectedInitialState: State = null;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const user = createUser();
      const action: Action = fetchSuccess(user);
      const result = reducer(undefined, action);
      const expected: State = user;
      expect(result).toEqual(expected);
    });
  });
  describe(SIGN_OUT, () => {
    it('Default', () => {
      const action: AuthenticationAction = {type: SIGN_OUT};
      const result = reducer(undefined, action);
      const expected: State = expectedInitialState;

      expect(result).toEqual(expected);
    });
  });
});
