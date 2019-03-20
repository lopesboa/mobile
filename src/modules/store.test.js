// @flow strict

describe('store', () => {
  let {Platform} = require('react-native');
  Platform.OS = 'ios';
  jest.mock('cross-fetch');
  const fetch = require('cross-fetch');

  describe('getMinimalVersion', () => {
    it('should handle resolve', async () => {
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('1.0.0')
      }));
      const {getMinimalVersion} = require('./store');

      const result = await getMinimalVersion();

      expect(result).toEqual('1.0.0');
    });

    it('should handle reject', async () => {
      fetch.mockImplementation(() => Promise.reject(new Error('Fake error')));
      const {getMinimalVersion} = require('./store');

      const result = await getMinimalVersion();

      expect(result).toBeFalsy();
    });
  });

  describe('needUpgrade', () => {
    it('should return false on undefined version', async () => {
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve(undefined)
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
    });

    it('should return false on same version', async () => {
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('0.0.0')
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
    });

    it('should return true on anterior version', async () => {
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('0.0.1')
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeTruthy();
    });

    it('should handle reject', async () => {
      fetch.mockImplementation(() => Promise.reject(new Error('Fake error')));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
    });
  });

  describe('getStoreUri', () => {
    it('should return iOS uri', () => {
      Platform.OS = 'ios';
      const {getStoreUri, APP_STORE_ID} = require('./store');

      const result = getStoreUri();
      const expected = `https://itunes.apple.com/app/apple-store/id${APP_STORE_ID}`;

      expect(result).toEqual(expected);
    });

    it('should return Android uri', () => {
      Platform.OS = 'android';
      const {getStoreUri, PLAY_STORE_ID} = require('./store');

      const result = getStoreUri();
      const expected = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;

      expect(result).toEqual(expected);
    });
  });
});
