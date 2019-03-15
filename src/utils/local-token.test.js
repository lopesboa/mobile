// @flow

import {AsyncStorage} from 'react-native';
import localToken from './local-token';

describe('LocalToken', () => {
  it('should successfully set a token', async () => {
    AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve('mytoken'));
    await localToken.set('mytoken');
    const token = localToken.get();
    return expect(token).resolves.toEqual('mytoken');
  });
  it('should return null', async () => {
    AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.resolve(null));
    await localToken.set('mytoken');
    const token = localToken.get();
    return expect(token).resolves.toEqual(null);
  });
});
