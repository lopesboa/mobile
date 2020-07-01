import AsyncStorage from '@react-native-community/async-storage';

import {createToken} from '../__fixtures__/tokens';

jest.mock('@react-native-community/async-storage');

describe('Local token', () => {
  const token = createToken({});

  describe('set', () => {
    it('should set token', async () => {
      // @ts-ignore
      AsyncStorage.setItem.mockImplementationOnce((key: string, value: string) => {
        expect(key).toEqual('@@token');
        expect(value).toEqual(token);
      });

      const {set} = require('./local-token');

      await set(token);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should get token', async () => {
      // @ts-ignore
      AsyncStorage.getItem.mockImplementationOnce((key: string) => {
        expect(key).toEqual('@@token');

        return token;
      });

      const {get} = require('./local-token');

      const result = await get();

      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result).toEqual(token);
    });
  });

  describe('remove', () => {
    it('should remove a token', async () => {
      // @ts-ignore
      AsyncStorage.setItem.mockImplementationOnce((key: string, value: string) => {
        expect(key).toEqual('@@token');
        expect(value).toEqual(null);
      });

      const {remove} = require('./local-token');

      await remove();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
