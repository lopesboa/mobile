import {createUser} from '../__fixtures__/user';
import type {DataLayer} from '../layer/data';
import {fakeError} from '../utils/tests';
import createService from './users';

describe('User service', () => {
  it('find', () => {
    const token = '__TOKEN__';
    const user = createUser();

    const fetchUser = jest.fn();
    fetchUser.mockImplementationOnce((workingToken: string) => {
      expect(token).toEqual(workingToken);
      return Promise.resolve(user);
    }) as Pick<DataLayer, 'fetchUser'>;

    // @ts-ignore
    const service = createService({fetchUser});

    return expect(service.find(token)).resolves.toEqual(user);
  });
  it('find', () => {
    const token = '__TOKEN__';

    const fetchUser = jest.fn();
    fetchUser.mockImplementationOnce((workingToken: string) => {
      expect(token).toEqual(workingToken);
      return Promise.reject(fakeError);
    }) as Pick<DataLayer, 'fetchUser'>;

    // @ts-ignore
    const service = createService({fetchUser});

    return expect(service.find(token)).rejects.toThrow(fakeError);
  });
});
