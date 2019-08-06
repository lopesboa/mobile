// @flow strict

import {fakeError} from '../../../utils/tests';
import {setRequest, setSuccess, setError, setLanguage} from './set';

describe('Language', () => {
  describe('setLanguage', () => {
    it('should set the language', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Language: {
            getFromInterface: jest.fn().mockImplementationOnce(() => 'zh-TW'),
            set: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setSuccess('de'));
        return action;
      });

      // $FlowFixMe
      const result = await setLanguage('de')(dispatch, getState, options);

      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(0);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith('de');
      expect(result).toEqual(setSuccess('de'));
    });

    it('should fallback to interface language', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Language: {
            getFromInterface: jest.fn().mockImplementationOnce(() => 'zh-TW'),
            set: jest.fn()
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setSuccess('zh-TW'));
        return action;
      });

      // $FlowFixMe
      const result = await setLanguage(null)(dispatch, getState, options);

      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith('zh-TW');
      expect(result).toEqual(setSuccess('zh-TW'));
    });

    it('should handle error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Language: {
            getFromInterface: jest.fn().mockImplementationOnce(() => 'zh-TW'),
            set: jest.fn().mockImplementationOnce(() => {
              throw fakeError;
            })
          }
        }
      };

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setRequest());
        return action;
      });
      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(setError(fakeError));
        return action;
      });

      // $FlowFixMe
      const result = await setLanguage('en')(dispatch, getState, options);

      expect(options.services.Language.getFromInterface).toHaveBeenCalledTimes(0);
      expect(options.services.Language.set).toHaveBeenCalledTimes(1);
      expect(options.services.Language.set).toHaveBeenCalledWith('en');
      expect(result).toEqual(setError(fakeError));
    });
  });
});
