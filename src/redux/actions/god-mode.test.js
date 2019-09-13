// @flow

import {ROLES} from '@coorpacademy/acl';

import {createProgression} from '../../__fixtures__/progression';
import {createToken} from '../../__fixtures__/tokens';
import {createStoreState, createAuthenticationState} from '../../__fixtures__/store';
import {ENGINE, CONTENT_TYPE} from '../../const';
import {TOGGLE, toggle} from './god-mode';
import type {Action} from './god-mode';

const progression = createProgression({
  engine: ENGINE.MICROLEARNING,
  progressionContent: {
    type: CONTENT_TYPE.LEVEL,
    ref: ''
  }
});

describe('GodMode', () => {
  describe('toggle', () => {
    it('should enable it', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication: createAuthenticationState({
            token: createToken({
              roles: [ROLES.GODMODE]
            })
          })
        })
      );
      const expected: Action = {
        type: TOGGLE,
        payload: true
      };
      // $FlowFixMe missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('should disable it', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          godMode: true,
          authentication: createAuthenticationState({
            token: createToken({
              roles: [ROLES.GODMODE]
            })
          })
        })
      );
      const expected: Action = {
        type: TOGGLE,
        payload: false
      };
      // $FlowFixMe missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('should have the right role', async () => {
      const dispatch: Dispatch = jest.fn();
      const getState: GetState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication: createAuthenticationState({
            token: createToken({})
          })
        })
      );
      // $FlowFixMe missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
