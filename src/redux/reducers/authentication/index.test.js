// @flow strict

import {initialState as tokenInitialState} from './token';
import type {State} from '.';
import reducer from '.';

describe('Authentification', () => {
  const expectedInitialState: State = {
    user: tokenInitialState,
    brand: null
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });
});
