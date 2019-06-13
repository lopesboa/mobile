// @flow strict

import {toJWT} from '../../utils/tests';
import {TOGGLE_FAST_SLIDE, toggleFastSlide} from './fastslide';
import type {Action} from './fastslide';

describe('FastSlide', () => {
  it('should set fastslide to true if user is fastslide', () => {
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
      expect(action).toEqual({payload: true, type: TOGGLE_FAST_SLIDE});
      return action;
    });

    getState.mockReturnValue({
      godmode: false,
      authentication: {user: {token, isGodModeUser: true}}
    });

    const toggleFn = toggleFastSlide()(dispatch, getState);
    const expected: Action = {
      type: TOGGLE_FAST_SLIDE,
      payload: true
    };
    expect(toggleFn && toggleFn()).toEqual(expected);
  });
  it('should not toggleFastSlide if user is not godmode', () => {
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

    const result = toggleFastSlide()(dispatch, getState);
    expect(result).toEqual(null);
  });
});
