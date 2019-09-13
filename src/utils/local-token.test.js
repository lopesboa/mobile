// @flow

import AsyncStorage from '@react-native-community/async-storage';

describe('Local token', () => {
  describe('set', () => {
    it('should not store the token if undefined', async () => {
      const {set} = require('./local-token').default;

      await set(null);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it('should successfully set a token', async () => {
      AsyncStorage.setItem.mockImplementation((key, value) => {
        expect(key).toEqual('@@token');
        expect(value).toEqual('mytoken');
      });

      const {set} = require('./local-token').default;

      await set('mytoken');

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return token', async () => {
      AsyncStorage.getItem.mockImplementation(key => {
        expect(key).toEqual('@@token');

        return 'foobar';
      });

      const {get} = require('./local-token').default;

      const result = await get();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(result).toEqual('foobar');
    });
  });

  describe('remove', () => {
    it('should remove a token', async () => {
      AsyncStorage.setItem.mockImplementation((key, value) => {
        expect(key).toEqual('@@token');
        expect(value).toEqual(null);
      });

      const {remove} = require('./local-token').default;

      await remove();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
