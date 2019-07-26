// @flow strict

import {fakeError} from '../../utils/tests';
import {find} from './content';
import {CONTENT_TYPE} from './_const';

jest.mock('./core', () => {
  const utils = require('../../utils/tests');

  return {
    fetchBundle: () => {
      // Dunno why we need this function only in this file
      return Promise.reject(utils.fakeError);
    },
    getItem: (type, language, ref) => {
      if (ref === 'void_ref') {
        return Promise.resolve(undefined);
      }
      if (type === 'ref_exception') {
        return Promise.reject(utils.fakeError);
      }

      return Promise.resolve({foo: 'bar'});
    }
  };
});

jest.mock('./mappers', () => ({
  mapToLevelAPI: () => ({type: 'level'}),
  mapToChapterAPI: () => ({type: 'chapter'}),
  mapToSlideAPI: () => ({type: 'slide'})
}));

jest.mock('cross-fetch');

describe('content', () => {
  describe('find', () => {
    it('should find level', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')(CONTENT_TYPE.LEVEL, 'ref_level');
      expect(result).toEqual({type: 'level'});
    });

    it('should find chapter', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')(CONTENT_TYPE.CHAPTER, 'ref_chapter');
      expect(result).toEqual({type: 'chapter'});
    });

    it('should find slide', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')(CONTENT_TYPE.SLIDE, 'ref_slide');
      expect(result).toEqual({type: 'slide'});
    });

    it('should handle unsupported type', () => {
      // $FlowFixMe this is only to test
      const result = find('en')('foobarbaz', 'ref_foobarbaz');
      expect(result).rejects.toThrow('foobarbaz not implemented');
    });

    it('should handle exception', () => {
      // $FlowFixMe this is only to test
      const result = find('en')(CONTENT_TYPE.SLIDE, 'ref_exception');
      expect(result).rejects.toThrow(fakeError);
    });

    it('should return undefined', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')(CONTENT_TYPE.SLIDE, 'void_ref');
      expect(result).not.toBeDefined();
    });
  });
});
