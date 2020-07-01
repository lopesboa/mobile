import {VIDEO_TRACK_TYPE} from '@coorpacademy/player-store';
import type {VideoTrack} from '../../types/coorpacademy/player-store';

import {fakeError} from '../../utils/tests';
import {createToken} from '../../__fixtures__/tokens';
import {createVideoUri, createVideoTracks} from '../../__fixtures__/videos';
import {VIDEO_PROVIDER} from './_const';

const videoId = '1234';
const videoUrl = createVideoUri(videoId, VIDEO_PROVIDER.JWPLAYER);
const videoTracks = createVideoTracks(videoId, VIDEO_TRACK_TYPE.VTT);

jest.mock('../../utils/local-token', () => {
  const {createToken: _createToken} = require('../../__fixtures__/tokens');

  return {
    get: jest.fn(() => Promise.resolve(_createToken({}))),
  };
});

describe('videos', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('findUriById', () => {
    it('should handle invalid token', async () => {
      const localToken = require('../../utils/local-token');
      // @ts-ignore this function is mocked
      localToken.get.mockImplementationOnce(() => Promise.resolve(null));

      const {findUriById} = require('./videos');

      const result = findUriById(videoId, VIDEO_PROVIDER.JWPLAYER);

      await expect(result).rejects.toThrow(new Error('Invalid token'));
    });

    it('should fetch e2e fixtures', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true,
      }));
      const {findUriById} = require('./videos');

      const result = await findUriById(videoId, VIDEO_PROVIDER.JWPLAYER);
      const expected = `https://content.jwplatform.com/videos/${videoId}.mp4`;

      return expect(result).toEqual(expected);
    });

    it('should fetch from host', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      const provider = VIDEO_PROVIDER.KONTIKI;

      fetch.mockImplementationOnce(
        (
          url,
          options,
        ): Promise<{
          json: () => Promise<{
            url: string;
          }>;
        }> => {
          expect(url).toBe(`https://domain.tld/api/v2/videos/${videoId}/provider/${provider}`);
          expect(options).toHaveProperty('headers.authorization', createToken({}));

          return Promise.resolve({
            json: () => Promise.resolve({url: videoUrl}),
          });
        },
      );

      const {findUriById} = require('./videos');

      const result = await findUriById(videoId, provider);
      const expected = videoUrl;

      return expect(result).toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {findUriById} = require('./videos');

      const result = findUriById(videoId, VIDEO_PROVIDER.JWPLAYER);

      return expect(result).rejects.toThrow(fakeError);
    });
  });

  describe('findTracksById', () => {
    it('should handle invalid token', async () => {
      const localToken = require('../../utils/local-token');
      // @ts-ignore this function is mocked
      localToken.get.mockImplementationOnce(() => Promise.resolve(null));

      const {findTracksById} = require('./videos');

      const result = findTracksById(videoId, VIDEO_TRACK_TYPE.VTT);

      await expect(result).rejects.toThrow(new Error('Invalid token'));
    });

    it('should fetch e2e fixtures', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true,
      }));
      const {findTracksById} = require('./videos');

      const result = await findTracksById(videoId, VIDEO_TRACK_TYPE.VTT);
      const expected = videoTracks;

      return expect(result).toEqual(expected);
    });

    it('should fetch from host', async () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      const trackType = VIDEO_TRACK_TYPE.VTT;

      fetch.mockImplementationOnce(
        (
          url,
          options,
        ): Promise<{
          json: () => Promise<Array<VideoTrack>>;
        }> => {
          expect(url).toBe(`https://domain.tld/api/v2/subtitles/video/${videoId}/${trackType}`);
          expect(options).toHaveProperty('headers.authorization', createToken({}));

          return Promise.resolve({
            json: () => Promise.resolve(videoTracks),
          });
        },
      );

      const {findTracksById} = require('./videos');

      const result = await findTracksById(videoId, trackType);
      const expected = videoTracks;

      return expect(result).toEqual(expected);
    });

    it('should reject error', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));
      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce((url, options) => Promise.reject(fakeError));

      const {findTracksById} = require('./videos');

      const result = findTracksById(videoId, VIDEO_TRACK_TYPE.VTT);

      return expect(result).rejects.toThrow(fakeError);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
