// @flow strict

import {fakeError} from '../../utils/tests';
import {find} from './content';
import {CONTENT_TYPE} from './_const';

jest.mock('./core', () => {
  const utils = require('../../utils/tests');

  return {
    fetchDisciplineBundle: () => {
      // Dunno why we need this function only in this file
      return Promise.reject(utils.fakeError);
    },
    getItem: (type, ref) => {
      switch (ref) {
        case 'ref_exception':
          return Promise.reject(utils.fakeError);
        case 'ref_level':
        case 'ref_chapter':
        case 'ref_slide':
          return Promise.resolve();
      }
    }
  };
});

jest.mock('./mappers', () => ({
  mapToLevelAPI: () => ({type: 'level'}),
  mapToChapterAPI: () => ({type: 'chapter'}),
  mapToSlideAPI: () => ({type: 'slide'})
}));

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
  });
});
