import {createBrand} from '../../__fixtures__/brands';
import {createToken} from '../../__fixtures__/tokens';
import {createUser} from '../../__fixtures__/user';
import {createAuthenticationState} from '../../__fixtures__/store';
import {createFakeAnalytics, createFakeLogger, fakeError} from '../../utils/tests';
import {ANALYTICS_EVENT_TYPE, AUTHENTICATION_TYPE} from '../../const';
import {fetchRequest as fetchBrandRequest, fetchSuccess as fetchBrandSuccess} from './brands';
import {fetchRequest as fetchUserRequest, fetchSuccess as fetchUserSuccess} from './user';

jest.doMock('../../utils/local-token');

const language = 'fr';

describe('Authentication', () => {
  describe('getAnonymousToken', () => {
    it('should return token', async () => {
      const fetch = require('cross-fetch');
      const token = createToken({});
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        return Promise.resolve({text: () => Promise.resolve(token)});
      });

      const {getAnonymousToken} = require('./authentication');

      const result = await getAnonymousToken();

      return expect(result).toEqual(token);
    });

    it('should handle error', () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        const {fakeError: _fakeError} = require('../../utils/tests');
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        throw _fakeError;
      });

      const {getAnonymousToken} = require('./authentication');

      const result = getAnonymousToken();

      return expect(result).rejects.toThrow(fakeError);
    });
  });

  describe('signIn', () => {
    const authenticationType = AUTHENTICATION_TYPE.QR_CODE;

    it('should sign in the user', async () => {
      const {signIn, signInRequest, signInSuccess} = require('./authentication');

      const brand = createBrand();
      const user = createUser();
      const token = createToken({});

      const dispatch = jest.fn();
      const getState = jest.fn();

      getState.mockReturnValue({
        authentication: createAuthenticationState({brand}),
      });

      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand)),
          },
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Language: {
            set: jest.fn(),
            getFromInterface: jest.fn(() => language),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchBrandRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchBrandSuccess(brand));
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchUserRequest());
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchUserSuccess(user));
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInSuccess(token));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledTimes(1);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_IN,
        {
          userId: 'foobar',
          brand: brand.name,
          authenticationType,
        },
      );
      expect(options.services.Logger.setProperties).toHaveBeenCalledTimes(1);
      expect(options.services.Logger.setProperties).toHaveBeenCalledWith({
        userId: 'foobar',
        brand: brand.name,
      });
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInSuccess(token));
    });

    it('should sign in as anonymous', async () => {
      const brand = createBrand();
      const token = createToken({
        brand: brand.name,
      });
      const user = createUser();

      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        return Promise.resolve({text: () => Promise.resolve(token)});
      });

      const {signIn, signInRequest, signInSuccess} = require('./authentication');

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: createAuthenticationState({brand}),
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand)),
          },
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchBrandRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchBrandSuccess(brand));
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchUserRequest());
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchUserSuccess(user));
        return action;
      });
      dispatch.mockImplementationOnce((action) => action);
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInSuccess(token));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledTimes(1);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_IN,
        {
          userId: 'foobar',
          brand: brand.name,
          authenticationType,
        },
      );
      expect(options.services.Logger.setProperties).toHaveBeenCalledTimes(1);
      expect(options.services.Logger.setProperties).toHaveBeenCalledWith({
        userId: 'foobar',
        brand: brand.name,
      });
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInSuccess(token));
    });

    it('should handle error on anonymous sign in', async () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, fetchOptions) => {
        const {fakeError: _fakeError} = require('../../utils/tests');

        expect(fetchOptions.method).toBe('POST');
        expect(url).toEqual('https://up.coorpacademy.com/api/v1/anonymous/mobile');

        throw _fakeError;
      });

      const user = createUser();

      const {signIn, signInRequest, signInError} = require('./authentication');

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInError(fakeError));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();
      expect(options.services.Logger.setProperties).not.toHaveBeenCalled();
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInError(fakeError));
    });

    it('should reject non-coorpacademy token', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');

      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      const token = createToken({iss: '360-learning'});

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();
      expect(options.services.Logger.setProperties).not.toHaveBeenCalled();
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
    });

    it('should reject if host is missing', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');

      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      const token = createToken({
        host: null,
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();
      expect(options.services.Logger.setProperties).not.toHaveBeenCalled();
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInError(new Error("JWT isn't from Coorpacademy")));
    });

    it('should reject if fetching brand failed', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');
      const {fetchRequest, fetchError} = require('./brands');

      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Brands: {
            find: jest.fn(() => Promise.reject(fakeError)),
          },
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      const token = createToken({});

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(fakeError));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInError(new Error()));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();
      expect(options.services.Logger.setProperties).not.toHaveBeenCalled();
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInError(new Error()));
    });

    it('should reject if brand is missing', async () => {
      const {signIn, signInRequest, signInError} = require('./authentication');
      const {fetchRequest, fetchSuccess} = require('./brands');

      const brand = createBrand();
      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();
      // @todo replace with fixture creator
      getState.mockReturnValue({
        authentication: {
          brand: null,
        },
      });
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Brands: {
            find: jest.fn(() => Promise.resolve(brand)),
          },
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      const token = createToken({});

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInRequest(token));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchSuccess(brand));
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(signInError(new Error('Incorrect brand')));
        return action;
      });

      // @ts-ignore
      const current = await signIn(authenticationType, token)(dispatch, getState, options);
      expect(options.services.Analytics.logEvent).not.toHaveBeenCalled();
      expect(options.services.Logger.setProperties).not.toHaveBeenCalled();
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);

      return expect(current).toEqual(signInError(new Error('Incorrect brand')));
    });
  });

  describe('signOut', () => {
    it('should dispatch sign out', async () => {
      const token = createToken({});

      const {SIGN_OUT, signOut} = require('./authentication');

      const brand = createBrand();
      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: createAuthenticationState({token, brand}),
      });
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual({
          type: SIGN_OUT,
        });
        return action;
      });

      // @ts-ignore
      const current = await signOut()(dispatch, getState, options);
      const expected = {type: SIGN_OUT};
      expect(options.services.Analytics.logEvent).toHaveBeenCalledTimes(1);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_OUT,
        {
          userId: 'foobar',
          brand: brand.name,
        },
      );
      expect(options.services.Logger.setProperties).toHaveBeenCalledTimes(1);
      expect(options.services.Logger.setProperties).toHaveBeenCalledWith({
        userId: null,
        brand: null,
      });
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);
      expect(current).toEqual(expected);
    });

    it('should dispatch sign out -- without token', async () => {
      const token = null;

      const {SIGN_OUT, signOut} = require('./authentication');

      const brand = createBrand();
      const user = createUser();

      const dispatch = jest.fn();
      const getState = jest.fn();

      getState.mockReturnValue({
        authentication: createAuthenticationState({token, brand}),
      });
      const options = {
        services: {
          Users: {
            find: jest.fn(() => Promise.resolve(user)),
          },
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual({
          type: SIGN_OUT,
        });
        return action;
      });

      // @ts-ignore
      const current = await signOut()(dispatch, getState, options);
      const expected = {type: SIGN_OUT};
      expect(options.services.Analytics.logEvent).toHaveBeenCalledTimes(1);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_OUT,
        {
          userId: undefined,
          brand: brand.name,
        },
      );
      expect(options.services.Logger.setProperties).toHaveBeenCalledTimes(1);
      expect(options.services.Logger.setProperties).toHaveBeenCalledWith({
        userId: null,
        brand: null,
      });
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);
      expect(current).toEqual(expected);
    });

    it('should dispatch sign out -- without brand', async () => {
      const token = createToken({});

      const {SIGN_OUT, signOut} = require('./authentication');

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        authentication: createAuthenticationState({token, brand: null}),
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics(),
          Logger: createFakeLogger(),
          Language: {
            getFromInterface: jest.fn(() => language),
            set: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual({
          type: SIGN_OUT,
        });
        return action;
      });

      // @ts-ignore
      const current = await signOut()(dispatch, getState, options);
      const expected = {type: SIGN_OUT};
      expect(options.services.Analytics.logEvent).toHaveBeenCalledTimes(1);
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.SIGN_OUT,
        {
          userId: 'foobar',
          brand: undefined,
        },
      );
      expect(options.services.Logger.setProperties).toHaveBeenCalledTimes(1);
      expect(options.services.Logger.setProperties).toHaveBeenCalledWith({
        userId: null,
        brand: null,
      });
      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith(language);
      expect(current).toEqual(expected);
    });
  });
});
