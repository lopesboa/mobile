// @flow

import {createBrand} from '../../__fixtures__/brands';
import {toJWT, createFakeAnalytics, fakeError} from '../../utils/tests';
import {ANALYTICS_EVENT_TYPE, AUTHENTICATION_TYPE} from '../../const';

jest.mock('../../utils/local-token');
jest.mock('cross-fetch');

describe('Authentication', () => {
  describe('getAnonymousToken', () => {
    it('should return token', async () => {
      const fetch = require('cross-fetch');
      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        return Promise.resolve({text: () => Promise.resolve(token)});
      });

      const {getAnonymousToken} = require('./authentication');

      // $FlowFixMe
      const result = await getAnonymousToken();

      return expect(result).toEqual(token);
    });

    it('should handle error', () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        throw new Error('Oops i did it again');
      });

      const {getAnonymousToken} = require('./authentication');

      const result = getAnonymousToken();

      return expect(result).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    const authenticationType = AUTHENTICATION_TYPE.QR_CODE;
    it('should sign in the user', async () => {
      const {signIn, signInRequest, signInSuccess} = require('./authentication');
      const {fetchRequest, fetchSuccess} = require('./brands');

      const brand = createBrand();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: {
          brand
        }
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand))
          }
        }
      };

      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess(brand));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInSuccess({token, isGodModeUser: false}));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_IN,
        {
          userId: '42',
          brand: brand.name,
          authenticationType
        }
      );

      return expect(actual).toEqual(signInSuccess({token, isGodModeUser: false}));
    });

    it('should sign in as anonymous', async () => {
      const token = toJWT({
        user: '4242',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        return Promise.resolve({text: () => Promise.resolve(token)});
      });

      const {signIn, signInRequest, signInSuccess} = require('./authentication');
      const {fetchRequest, fetchSuccess} = require('./brands');

      const brand = createBrand();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: {
          brand
        }
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand))
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess(brand));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInSuccess({token, isGodModeUser: false}));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_IN,
        {
          userId: '4242',
          brand: brand.name,
          authenticationType
        }
      );

      return expect(actual).toEqual(signInSuccess({token, isGodModeUser: false}));
    });

    it('should handle error on anonymous sign in', async () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        throw new Error('Oops i did it again');
      });

      const {signIn, signInRequest, signInError} = require('./authentication');

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInError(new Error('Oops i did it again')));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();

      return expect(actual).toEqual(signInError(new Error('Oops i did it again')));
    });

    it('should reject non-coorpacademy token', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');

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
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();

      return expect(actual).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
    });

    it('should reject if host is missing', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');

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
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();

      return expect(actual).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
    });

    it('should reject if fetching brand failed', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');
      const {fetchRequest, fetchError} = require('./brands');

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Brands: {
            find: jest.fn(() => Promise.reject(fakeError))
          }
        }
      };

      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError(fakeError));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInError(new Error()));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();

      return expect(actual).toEqual(signInError(new Error()));
    });

    it('should reject if brand is missing', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');
      const {fetchRequest, fetchSuccess} = require('./brands');

      const brand = createBrand();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: {
          brand: null
        }
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand))
          }
        }
      };

      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess(brand));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(signInError(new Error('Incorrect brand')));
        return action;
      });

      // $FlowFixMe
      const actual = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();

      return expect(actual).toEqual(signInError(new Error('Incorrect brand')));
    });
  });

  describe('signOut', () => {
    it('should dispatch sign out', async () => {
      const token = toJWT({
        user: '42',
        iss: 'coorpacademy-jwt',
        host: 'https://onboarding.coorpacademy.com'
      });

      const {SIGN_OUT, signOut} = require('./authentication');

      const brand = createBrand();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        }
      });
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
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_OUT,
        {
          userId: '42',
          brand: brand.name
        }
      );
      expect(actual).toEqual(expected);
    });

    it('should dispatch sign out -- without token', async () => {
      const token = null;

      const {SIGN_OUT, signOut} = require('./authentication');

      const brand = createBrand();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: {
          user: {
            token,
            isGodModeUser: false
          },
          brand
        }
      });
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
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_OUT,
        {
          userId: undefined,
          brand: brand.name
        }
      );
      expect(actual).toEqual(expected);
    });
  });
});
