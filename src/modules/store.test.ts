describe('store', () => {
  beforeEach(async () => {
    await jest.resetModules();
  });

  describe('getMinimalVersion', () => {
    it('should handle resolve', async () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('1.0.0'),
      }));
      const {getMinimalVersion} = require('./store');

      const result = await getMinimalVersion();

      expect(result).toEqual('1.0.0');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle reject', async () => {
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => Promise.reject(new Error('Fake error')));
      const {getMinimalVersion} = require('./store');

      const result = await getMinimalVersion();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('needUpgrade', () => {
    beforeEach(async () => {
      await jest.resetModules();
    });

    it('should return false on undefined version', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
      }));
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve(undefined),
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return false on same version', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
      }));
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('0.0.0'),
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return true on anterior version', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
      }));
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => ({
        text: () => Promise.resolve('0.0.1'),
      }));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeTruthy();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return false on non production mode', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: false,
      }));
      const fetch = require('cross-fetch');
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(0);
    });

    it('should return false on e2e mode', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
        __E2E__: true,
      }));
      const fetch = require('cross-fetch');
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(0);
    });

    it('should handle reject', async () => {
      jest.mock('./environment', () => ({
        __PRODUCTION__: true,
      }));
      const fetch = require('cross-fetch');
      fetch.mockImplementation(() => Promise.reject(new Error('Fake error')));
      const {needUpgrade} = require('./store');

      const result = await needUpgrade();

      expect(result).toBeFalsy();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    afterEach(async () => {
      await jest.resetAllMocks();
    });
  });

  describe('getStoreUri', () => {
    it('should return iOS uri', () => {
      const {Platform} = require('react-native');
      Platform.OS = 'ios';
      const {getStoreUri, APP_STORE_ID} = require('./store');

      const result = getStoreUri();
      const expected = `https://itunes.apple.com/us/app/id${APP_STORE_ID}?mt=8`;

      expect(result).toEqual(expected);
    });

    it('should return Android uri', () => {
      const {Platform} = require('react-native');
      Platform.OS = 'android';
      const {getStoreUri, PLAY_STORE_ID} = require('./store');

      const result = getStoreUri();
      const expected = `http://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;

      expect(result).toEqual(expected);
    });
  });

  afterEach(async () => {
    await jest.resetAllMocks();
  });
});
