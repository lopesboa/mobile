// @flow strict

import {image, video, emptyMedia, pdf} from '../__fixtures__/medias';
import {getMediaUrl, getMediaPoster, getMediaType} from './media';

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
      'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain'
    );
  });

  it('should return the URL -- IMG case with src ', () => {
    const result = getMediaUrl(image);

    expect(result).toBe(
      'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain'
    );
  });

  it('should return the URL -- VIDEO case ', () => {
    const result = getMediaUrl(video);

    expect(result).toBe(
      'https://player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075'
    );
  });

  it('should return the URL -- VIDEO case ', () => {
    const videoId = 'foo';
    const result = getMediaUrl({...video, videoId: videoId});
    expect(result).toEqual(`https://content.jwplatform.com/videos/${videoId}.mp4`);
  });

  it('should return the URL -- EMPTY MEDIA case ', () => {
    const result = getMediaUrl(emptyMedia);
    expect(result).not.toBeDefined();
  });

  it('should return the URL -- PDF  case ', () => {
    const result = getMediaUrl(pdf);
    expect(result).toBe(
      'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain'
    );
  });
});

describe('getMediaPoster', () => {
  it('should return the POSTER -- VIDEO case ', () => {
    const result = getMediaPoster(video);
    expect(result).toBe(
      'https://player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075'
    );
  });

  it('should return the poster -- IMAGE case ', () => {
    const result = getMediaPoster(image);
    expect(result).not.toBeDefined();
  });
});
