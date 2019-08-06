// @flow

import {fakeError} from '../../utils/tests';
import {createToken} from '../../__fixtures__/tokens';
import {createVideoUrl} from '../../__fixtures__/videos';
import {VIDEO_PROVIDER} from './_const';

const videoUrl = createVideoUrl('1234', VIDEO_PROVIDER.JWPLAYER);

jest.mock('../../utils/local-token', () => {
  const {createToken: _createToken} = require('../../__fixtures__/tokens');

  return {
    get: jest.fn(() => Promise.resolve(_createToken({})))
  };
});

describe('videos', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('findUriById', () => {
    it('should handle invalid token', async () => {
      const localToken = require('../../utils/local-token');
      // $FlowFixMe this function is mocked
      localToken.get.mockImplementationOnce(() => Promise.resolve(null));

      const {findUriById} = require('./videos');

      const id = '1234';

      const result = findUriById(id, VIDEO_PROVIDER.JWPLAYER);

      await expect(result).rejects.toThrow(new Error('Invalid token'));
    });

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
          expect(url).toBe(`https://domain.tld/api/v2/videos/1234/provider/${provider}`);
          expect(options).toHaveProperty('headers.authorization', createToken({}));

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
