// @flow

import AsyncStorage from '@react-native-community/async-storage';

import {toJWT, fakeError} from '../../utils/tests';
import {createVideoUrl} from '../../__fixtures__/videos';
import type {JWT} from '../../types';
import {VIDEO_PROVIDER} from './_const';

const videoUrl = createVideoUrl('1234', VIDEO_PROVIDER.JWPLAYER);
const jwt: JWT = {
  host: 'host',
  user: 'plop',
  iss: 'plip',
  grants: {mooc: 'foo'},
  exp: 1,
  iat: 1,
  usage: 'ploup'
};
const token = toJWT(jwt);

AsyncStorage.getItem = jest.fn().mockImplementation(key => (key === '@@token' ? token : null));

describe('videos', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('findUriById', () => {
    it('should fetch e2e fixtures', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {findUriById} = require('./videos');

      const id = '1234';

      const result = await findUriById(id, VIDEO_PROVIDER.JWPLAYER);
      const expected = `https://content.jwplatform.com/videos/${id}.mp4`;

      return expect(result).toEqual(expected);
    });

    it('should fetch from host', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      const provider = VIDEO_PROVIDER.KONTIKI;

      fetch.mockImplementationOnce(
        (
          url,
          options
        ): Promise<{
          json: () => Promise<{|
            url: string
          |}>
        }> => {
          expect(url).toBe(`host/api/v2/videos/1234/provider/${provider}`);
          expect(options).toHaveProperty('headers.authorization', token);

          return Promise.resolve({
            json: () => Promise.resolve({url: videoUrl})
          });
        }
      );

      const {findUriById} = require('./videos');

      const result = await findUriById('1234', provider);
      const expected = videoUrl;

      return expect(result).toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      jest.mock('cross-fetch');
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {findUriById} = require('./videos');

      const result = findUriById('1234', VIDEO_PROVIDER.JWPLAYER);

      return expect(result).rejects.toThrow(fakeError);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
