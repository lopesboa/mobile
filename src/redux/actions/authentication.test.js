// @flow strict

import {toJWT} from '../../utils/tests';
import {signIn, signOut, SIGN_IN_SUCCESS, SIGN_IN_REQUEST, SIGN_IN_ERROR} from './authentication';

describe('Authentication', () => {
  describe('signIn', () => {
    it('success', async () => {
      const dispatch = jest.fn();

      const token = toJWT({
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_REQUEST,
          payload: token
        });
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_SUCCESS,
          payload: token
        });
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(token)(dispatch);
      return expect(actual).toEqual({
        type: SIGN_IN_SUCCESS,
        payload: token
      });
    });
    it('should reject non-coorpacademy token', async () => {
      const dispatch = jest.fn();

      const token = toJWT({
        iss: '360-learning',
        host: 'https://onboarding.coorpacademy.com'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_REQUEST,
          payload: token
        });
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_ERROR,
          payload: new Error("JWT isn't from Coorpacademy"),
          error: true
        });
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(token)(dispatch);
      return expect(actual).toEqual({
        type: SIGN_IN_ERROR,
        payload: new Error("JWT isn't from Coorpacademy"),
        error: true
      });
    });
    it('should reject if host is missing', async () => {
      const dispatch = jest.fn();

      const token = toJWT({
        iss: 'coorpacademy-jwt'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_REQUEST,
          payload: token
        });
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_IN_ERROR,
          payload: new Error("JWT isn't from Coorpacademy"),
          error: true
        });
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(token)(dispatch);
      return expect(actual).toEqual({
        type: SIGN_IN_ERROR,
        payload: new Error("JWT isn't from Coorpacademy"),
        error: true
      });
    });
  });
  it('signOut', () => {
    expect(signOut()).toBeDefined();
  });
});
