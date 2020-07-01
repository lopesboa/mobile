import {initialState as userInitialState} from './user';
import {initialState as tokenInitialState} from './token';
import type {State} from '.';
import reducer from '.';

describe('Authentification', () => {
  const expectedInitialState: State = {
    token: tokenInitialState,
    user: userInitialState,
    brand: null,
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });
});
