import AsyncStorage from '@react-native-community/async-storage';

import {createToken} from '../__fixtures__/tokens';

describe('Local token', () => {
  const token = createToken({});

  describe('set', () => {
    it('should set token', async () => {
      AsyncStorage.setItem.mockImplementationOnce((key, value) => {
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
      AsyncStorage.getItem.mockImplementationOnce(key => {
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
      AsyncStorage.setItem.mockImplementationOnce((key, value) => {
        expect(key).toEqual('@@token');
        expect(value).toEqual(null);
      });

      const {remove} = require('./local-token');

      await remove();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
