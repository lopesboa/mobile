// @flow strict

import {createToken} from '../../__fixtures__/tokens';
import {TOGGLE_GOD_MODE, toggleGodMode} from './godmode';
import type {Action} from './godmode';

describe('God mode', () => {
  it('should set godmode to true if user is godmode', () => {
    const dispatch: Dispatch = jest.fn();
    const getState: GetState = jest.fn();

    const token = createToken({
      roles: ['user', 'godmode']
    });

    dispatch.mockImplementationOnce(action => {
      expect(action).toEqual({payload: true, type: TOGGLE_GOD_MODE});
      return action;
    });

    getState.mockReturnValue({
      godmode: false,
      authentication: {user: {token, isGodModeUser: true}}
    });

    const toggleFn = toggleGodMode()(dispatch, getState);
    const expected: Action = {
      type: TOGGLE_GOD_MODE,
      payload: true
    };
    expect(toggleFn && toggleFn()).toEqual(expected);
  });

  it('should not toggleGodMode if user is not godmode', () => {
    const dispatch: Dispatch = jest.fn();
    const getState: GetState = jest.fn();

    const token = createToken({});

    getState.mockReturnValue({
      godmode: false,
      authentication: {user: {token, isGodModeUser: false}}
    });

    const result = toggleGodMode()(dispatch, getState);
    expect(result).toEqual(null);
  });
});
