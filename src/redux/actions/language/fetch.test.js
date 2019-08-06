// @flow strict

import {fakeError} from '../../../utils/tests';
import {fetchRequest, fetchSuccess, fetchError, fetchLanguage} from './fetch';
import {setRequest, setSuccess} from './set';

describe('Language', () => {
  describe('fetchLanguage', () => {
    it('should fetch the language and set it', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Language: {
            fetch: jest.fn().mockImplementationOnce(() => Promise.resolve('en')),
            set: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setSuccess('en'));
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchSuccess('en'));
        return action;
      });

      // $FlowFixMe
      const current = await fetchLanguage(dispatch, getState, options);
      expect(options.services.Language.fetch).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith('en');
      expect(current).toEqual(fetchSuccess('en'));
    });

    it('should handle error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Language: {
            fetch: jest.fn().mockImplementationOnce(() => Promise.reject(fakeError)),
            set: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(fetchError(fakeError));
        return action;
      });

      // $FlowFixMe
      const current = await fetchLanguage(dispatch, getState, options);
      expect(options.services.Language.fetch).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(0);
      expect(current).toEqual(fetchError(fakeError));
    });
  });
});
