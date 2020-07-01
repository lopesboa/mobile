import {VIDEO_MIME_TYPE} from '../const';
import {VIDEO_PROVIDER} from '../layer/data/_const';
import {image, video, emptyMedia, pdf} from '../__fixtures__/medias';
import {
  getMediaUrl,
  getMediaPoster,
  getMediaType,
  getVideoProvider,
  isMediaSupported,
} from './media';

describe('media', () => {
  describe('getMediaType', () => {
    it('should return the type -- VIDEO case ', () => {
      const result = getMediaType(video);

      expect(result).toEqual('video');
    });

    it('should return the type -- VIDEO case ', () => {
      const result = getMediaPoster({...image, type: undefined});
      expect(result).not.toBeDefined();
    });
  });

  describe('getMediaURl', () => {
    it('should return the URL -- IMG case ', () => {
      const result = getMediaUrl({...image, src: undefined});

      expect(result).toEqual(
        'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain',
      );
    });

    it('should return the URL -- IMG case with src ', () => {
      const result = getMediaUrl(image);

      expect(result).toBe(
        'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain',
      );
    });

    it('should return the URL -- VIDEO case ', () => {
      const result = getMediaUrl(video);

      expect(result).toBe(
        'https://player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075',
      );
    });

    it('should return the URL -- VIDEO case without src ', () => {
      const result = getMediaUrl({
        type: 'video',
        mimeType: 'application/vimeo',
        url: '//player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4',
        src: undefined,
      });

      expect(result).toBe(
        'https://player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4',
      );
    });

    it('should return the URL -- VIDEO case jwplayer', () => {
      const videoId = 'foo';
      const _video = {
        ...video,
        mimeType: 'application/jwplayer',
        videoId: videoId,
      };
      const result = getMediaUrl(_video);
      expect(result).toEqual('https://content.jwplatform.com/videos/foo.mp4');
    });

    it('should return the URL -- EMPTY MEDIA case ', () => {
      const result = getMediaUrl(emptyMedia);
      expect(result).not.toBeDefined();
    });

    it('should return the URL -- PDF  case ', () => {
      const result = getMediaUrl(pdf);
      expect(result).toBe(
        'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain',
      );
    });
  });

  describe('getMediaPoster', () => {
    it('should return the POSTER -- VIDEO case ', () => {
      const result = getMediaPoster(video);
      expect(result).toBe(
        'https://player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075',
      );
    });

    it('should return the poster -- IMAGE case ', () => {
      const result = getMediaPoster(image);
      expect(result).not.toBeDefined();
    });
  });

  describe('getVideoProvider', () => {
    it('should return jwplayer', () => {
      const result = getVideoProvider(VIDEO_MIME_TYPE.JWPLAYER);
      const expected = VIDEO_PROVIDER.JWPLAYER;

      expect(result).toEqual(expected);
    });

    it('should return vimeo', () => {
      const result = getVideoProvider(VIDEO_MIME_TYPE.VIMEO);
      const expected = VIDEO_PROVIDER.VIMEO;

      expect(result).toEqual(expected);
    });

    it('should return kontiki', () => {
      const result = getVideoProvider(VIDEO_MIME_TYPE.KONTIKI);
      const expected = VIDEO_PROVIDER.KONTIKI;

      expect(result).toEqual(expected);
    });

    it('should return youtube', () => {
      const result = getVideoProvider(VIDEO_MIME_TYPE.YOUTUBE);
      const expected = VIDEO_PROVIDER.YOUTUBE;

      expect(result).toEqual(expected);
    });

    it('should return omniPlayer', () => {
      const result = getVideoProvider(VIDEO_MIME_TYPE.OMNIPLAYER);
      const expected = VIDEO_PROVIDER.OMNIPLAYER;

      expect(result).toEqual(expected);
    });

    it('should return nothing', () => {
      // @ts-ignore this is a fake provider
      const result = getVideoProvider('foobar');

      expect(result).not.toBeDefined();
    });
  });

  describe('isMediaSupported', () => {
    it('should return true', () => {
      const result = isMediaSupported(video);

      expect(result).toBeTruthy;
    });

    it('should return false on unsupported type', () => {
      // @ts-ignore volontary wrong media
      const result = isMediaSupported({
        ...video,
        type: 'foo',
      });

      expect(result).toBeFalsy;
    });

    it('should return false without media url', () => {
      const result = isMediaSupported(emptyMedia);

      expect(result).toBeFalsy;
    });
  });
});
