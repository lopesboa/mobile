import {ROLES} from '@coorpacademy/acl';

import {createProgression} from '../../__fixtures__/progression';
import {createToken} from '../../__fixtures__/tokens';
import {createStoreState, createAuthenticationState} from '../../__fixtures__/store';
import {ENGINE, CONTENT_TYPE} from '../../const';
import type {Action, State} from '.';
import reducer, {toggle, ACTION_NAME} from '.';

const progression = createProgression({
  engine: ENGINE.MICROLEARNING,
  progressionContent: {
    type: CONTENT_TYPE.LEVEL,
    ref: '',
  },
});

describe('FastSlide', () => {
  describe('reducer', () => {
    const expectedInitialState: State = false;

    it('returns the default state if we pass an invalid action', () => {
      const action = {
        type: 'FAKE_ACTION',
      };
      // @ts-ignore we are trying to emulate something else
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
    });

    it('returns the new state if we pass a valid action', () => {
      const action: Action = {
        type: ACTION_NAME,
        payload: true,
      };
      const result = reducer(undefined, action);
      const expected: State = true;
      expect(result).toEqual(expected);
    });
  });

  describe('action', () => {
    it('should enable it', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication: createAuthenticationState({
            token: createToken({
              roles: [ROLES.GODMODE],
            }),
          }),
        }),
      );
      const expected: Action = {
        type: ACTION_NAME,
        payload: true,
      };
      // @ts-ignore missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('should disable it', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          fastSlide: true,
          authentication: createAuthenticationState({
            token: createToken({
              roles: [ROLES.GODMODE],
            }),
          }),
        }),
      );
      const expected: Action = {
        type: ACTION_NAME,
        payload: false,
      };
      // @ts-ignore missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('should have the right role', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() =>
        createStoreState({
          levels: [],
          disciplines: [],
          chapters: [],
          slides: [],
          progression,
          authentication: createAuthenticationState({
            token: createToken({}),
          }),
        }),
      );
      // @ts-ignore missing callable signature
      await toggle()(dispatch, getState);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
