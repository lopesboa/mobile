import {fakeError} from '../../utils/tests';
import {createUser} from '../../__fixtures__/user';

import {fetchRequest, fetchSuccess, fetchError, fetchUser} from './user';

const user = createUser();

describe('Users', () => {
  describe('fetchUser', () => {
    it('success', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchSuccess(user));
        return action;
      });
      options.services.Users.find.mockReturnValueOnce(Promise.resolve(user));

      // @ts-ignore
      const actual = await fetchUser('__TOKEN__')(dispatch, getState, options);
      return expect(actual).toEqual(fetchSuccess(user));
    });

    it('token is missing', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(new Error('Token not defined')));
        return action;
      });

      // @ts-ignore
      const actual = await fetchUser()(dispatch, getState, options);

      expect(options.services.Users.find).not.toHaveBeenCalled();
      return expect(actual).toEqual(fetchError(new Error('Token not defined')));
    });

    it('error on fetch failure', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Users: {
            find: jest.fn(),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchRequest());
        return action;
      });
      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(fetchError(fakeError));
        return action;
      });

      // @ts-ignore
      options.services.Users.find.mockImplementationOnce(Promise.reject(fakeError));

      // @ts-ignore
      const actual = await fetchUser('__TOKEN__')(dispatch, getState, options);
      return expect(actual).toEqual(fetchError(fakeError));
    });
  });
});
