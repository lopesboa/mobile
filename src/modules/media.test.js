// @flow strict

import {image, video, emptyMedia, pdf} from '../__fixtures__/medias';
import {getMediaUrl, getMediaPoster, getMediaType} from './media';

describe('getMediaType', () => {
  it('should return the type -- VIDEO case ', () => {
    const result = getMediaType(video);
    expect(result).toBeDefined();
  });

  it('should return the URL -- VIDEO case ', () => {
    const result = getMediaPoster({...image, type: undefined});
    expect(result).not.toBeDefined();
  });
});
describe('getMediaURl', () => {
  it('should return the URL -- IMG case ', () => {
    const result = getMediaUrl(image);

    expect(result).toBeDefined();
  });

  it('should return the URL -- IMG case with src ', () => {
    const result = getMediaUrl(image);
    expect(result).toBeDefined();
  });

  it('should return the URL -- VIDEO case ', () => {
    const result = getMediaUrl(video);

    expect(result).toBeDefined();
  });

  it('should return the URL -- EMPTY MEDIA case ', () => {
    const result = getMediaUrl(emptyMedia);
    expect(result).not.toBeDefined();
  });

  it('should return the URL -- PDF  case ', () => {
    const result = getMediaUrl(pdf);
    expect(result).toBeDefined();
  });
});

describe('getMediaPoster', () => {
  it('should return the POSTER -- VIDEO case ', () => {
    const result = getMediaPoster(video);
    expect(result).toBeDefined();
  });

  it('should return the poster -- IMAGE case ', () => {
    const result = getMediaPoster(image);
    expect(result).not.toBeDefined();
  });
});
