import AsyncStorage from '@react-native-community/async-storage';

import {createBrand} from '../__fixtures__/brands';

describe('Local brand', () => {
  const brand = createBrand({});

  describe('set', () => {
    it('should set brand', async () => {
      AsyncStorage.setItem.mockImplementationOnce((key: string, value: string) => {
        expect(key).toEqual('@@brand');
        expect(value).toEqual(JSON.stringify(brand));
      });

      const {set} = require('./local-brand');

      await set(brand);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should get brand', async () => {
      AsyncStorage.getItem.mockImplementationOnce((key) => {
        expect(key).toEqual('@@brand');

        return JSON.stringify(brand);
      });

      const {get} = require('./local-brand');

      const result = await get();

      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result).toEqual(brand);
    });

    it('should return null', async () => {
      AsyncStorage.getItem.mockImplementationOnce(() => null);

      const {get} = require('./local-brand');

      const result = await get();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(result).toBeNil;
    });
  });

  describe('remove', () => {
    it('should remove a brand', async () => {
      AsyncStorage.setItem.mockImplementationOnce((key: string, value: string) => {
        expect(key).toEqual('@@brand');
        expect(value).toEqual(null);
      });

      const {remove} = require('./local-brand');

      await remove();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
