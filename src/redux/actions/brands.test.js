// @flow strict

import {createFakeAnalytics} from '../../utils/tests';
import {createBrand} from '../../__fixtures__/brands';
import {fetchRequest, fetchSuccess, fetchError, fetchBrand} from './brands';

const brand = createBrand();

describe('Brands', () => {
  describe('fetchBrand', () => {
    it('success', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Brands: {
            find: jest.fn()
          },
          Analytics: createFakeAnalytics()
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess(brand));
        return action;
      });
      getState.mockReturnValueOnce({authentication: {token: '__TOKEN__'}});
      options.services.Brands.find.mockReturnValueOnce(Promise.resolve(brand));

      // $FlowFixMe
      const actual = await fetchBrand()(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).toHaveBeenCalledWith('brand', brand.name);
      return expect(actual).toEqual(fetchSuccess(brand));
    });

    it('token is missing', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Brands: {
            find: jest.fn()
          },
          Analytics: createFakeAnalytics()
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError('Token not defined'));
        return action;
      });
      getState.mockReturnValueOnce({authentication: {token: null}});

      // $FlowFixMe
      const actual = await fetchBrand()(dispatch, getState, options);

      expect(options.services.Brands.find).not.toHaveBeenCalled();
      expect(options.services.Analytics.setUserProperty).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError('Token not defined'));
    });

    it('error on fetch failure', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Brands: {
            find: jest.fn()
          },
          Analytics: createFakeAnalytics()
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError('Error'));
        return action;
      });
      getState.mockReturnValueOnce({authentication: {token: '__TOKEN__'}});
      options.services.Brands.find.mockRejectedValueOnce(new Error());

      // $FlowFixMe
      const actual = await fetchBrand()(dispatch, getState, options);
      expect(options.services.Analytics.setUserProperty).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError('Error'));
    });
  });
});
