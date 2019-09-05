// @flow strict

import {getResizedImage} from './image';

describe('Image', () => {
  describe('getResizedImage', () => {
    it('should return original url', () => {
      const result = getResizedImage('//foo.bar.baz', {});
      const expected = '//foo.bar.baz';
      expect(result).toEqual(expected);
    });

    it('should return image cropped by width', () => {
      const result = getResizedImage('//foo.bar.baz', {maxWidth: 200});
      const expected =
        'https://api.coorpacademy.com/api-service/medias?url=%2F%2Ffoo.bar.baz&m=crop&q=90&w=400';
      expect(result).toEqual(expected);
    });

    it('should return image cropped by height', () => {
      const result = getResizedImage('//foo.bar.baz', {maxHeight: 200});
      const expected =
        'https://api.coorpacademy.com/api-service/medias?url=%2F%2Ffoo.bar.baz&m=crop&q=90&h=400';
      expect(result).toEqual(expected);
    });

    it('should return image cropped width and height', () => {
      const result = getResizedImage('//foo.bar.baz', {maxWidth: 300, maxHeight: 200});
      const expected =
        'https://api.coorpacademy.com/api-service/medias?url=%2F%2Ffoo.bar.baz&m=crop&q=90&w=600&h=400';
      expect(result).toEqual(expected);
    });
  });
});
