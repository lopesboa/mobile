// @flow strict

import {toJWT} from '../../utils/tests';
import {
  signIn,
  signOut,
  SIGN_IN_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_ERROR,
  SIGN_OUT
} from './authentication';

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
  describe('signOut', () => {
    it('should dispatch logout if alert is accepted', async () => {
      jest.mock('Alert', () => ({
        alert: jest.fn()
      }));
      const Alert = require('Alert');
      Alert.alert.mockImplementationOnce((title, message, buttons) => {
        buttons[1].onPress();
      });

      const dispatch = jest.fn();

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_OUT
        });
        return action;
      });

      // $FlowFixMe
      const actual = await signOut()(dispatch);
      const expected = {type: SIGN_OUT};
      expect(actual).toEqual(expected);
    });
    it("shouldn't dispatch anything if alert is refused", async () => {
      jest.mock('Alert', () => ({
        alert: jest.fn()
      }));
      const Alert = require('Alert');
      Alert.alert.mockImplementationOnce((title, message, buttons) => {
        buttons[0].onPress();
      });

      const dispatch = jest.fn();

      // $FlowFixMe
      const actual = await signOut()(dispatch);

      expect(dispatch).not.toHaveBeenCalled();
      expect(actual).toBeUndefined();
    });
  });
});
