// @flow strict

import {toJWT, createFakeAnalytics} from '../../utils/tests';
import {
  signIn,
  signOut,
  signInAnonymous,
  SIGN_IN_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_ERROR,
  SIGN_OUT
} from './authentication';

jest.mock('cross-fetch');

describe('Authentication', () => {
  describe('signIn', () => {
    it('success', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      const token = toJWT({
        user: '42',
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
      const actual = await signIn(token)(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).toHaveBeenCalledWith('id', '42');
      return expect(actual).toEqual({
        type: SIGN_IN_SUCCESS,
        payload: token
      });
    });
    it('should reject non-coorpacademy token', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

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
      const actual = await signIn(token)(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).not.toHaveBeenCalled();
      return expect(actual).toEqual({
        type: SIGN_IN_ERROR,
        payload: new Error("JWT isn't from Coorpacademy"),
        error: true
      });
    });
    it('should reject if host is missing', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

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
      const actual = await signIn(token)(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).not.toHaveBeenCalled();
      return expect(actual).toEqual({
        type: SIGN_IN_ERROR,
        payload: new Error("JWT isn't from Coorpacademy"),
        error: true
      });
    });
  });
  describe('signInAnonymous', () => {
    it('success', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };
      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://up.coorpacademy.com'
      });

      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');
        return Promise.resolve({text: () => Promise.resolve(token)});
      });

      dispatch.mockImplementationOnce(action => {
        expect(action.type).toEqual(SIGN_IN_REQUEST);
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action.type).toEqual(SIGN_IN_SUCCESS);
        return action;
      });

      // $FlowFixMe
      const actual = await signInAnonymous()(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).toHaveBeenCalledWith('id', '42');
      return expect(actual.type).toEqual(SIGN_IN_SUCCESS);
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
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual({
          type: SIGN_OUT
        });
        return action;
      });

      // $FlowFixMe
      const actual = await signOut()(dispatch, getState, options);
      const expected = {type: SIGN_OUT};
      expect(options.services.Analytics.setUserProperty).toHaveBeenCalledTimes(2);
      // $FlowFixMe this is a mocked version
      expect(options.services.Analytics.setUserProperty.mock.calls[0]).toEqual(['id', null]);
      // $FlowFixMe this is a mocked version
      expect(options.services.Analytics.setUserProperty.mock.calls[1]).toEqual(['brand', null]);
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
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      // $FlowFixMe
      const actual = await signOut()(dispatch, getState, options);

      expect(dispatch).not.toHaveBeenCalled();
      expect(options.services.Analytics.setUserProperty).not.toHaveBeenCalled();
      expect(actual).toBeUndefined();
    });
  });
});
