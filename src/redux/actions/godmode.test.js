// @flow strict

import {toJWT} from '../../utils/tests';
import {TOGGLE_GOD_MODE, toggleGodMode} from './godmode';
import type {Action} from './godmode';

describe('God mode', () => {
  it('should set godmode to true if user is godmode', () => {
    const dispatch: Dispatch = jest.fn();
    const getState: GetState = jest.fn();

    const token = toJWT({
      user: '42',
      iss: 'coorpacademy-jwt',
      grants: {
        mooc: {
          grants: {
            onboarding: {
              roles: ['user', 'godmode']
            }
          }
        }
      },
      host: 'https://onboarding.coorpacademy.com'
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

    const token = toJWT({
      user: '42',
      iss: 'coorpacademy-jwt',
      grants: {
        mooc: {
          grants: {
            onboarding: {
              roles: ['user']
            }
          }
        }
      },
      host: 'https://onboarding.coorpacademy.com'
    });

    getState.mockReturnValue({
      godmode: false,
      authentication: {user: {token, isGodModeUser: false}}
    });

    const result = toggleGodMode()(dispatch, getState);
    expect(result).toEqual(null);
  });
});
