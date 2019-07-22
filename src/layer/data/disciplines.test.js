// @flow strict

import {fakeError} from '../../utils/tests';

jest.mock('./core', () => {
  const utils = require('../../utils/tests');
  const {createChapter} = require('../../__fixtures__/chapters');
  const {createDiscipline} = require('../../__fixtures__/disciplines');
  const {createLevel} = require('../../__fixtures__/levels');

  const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
  const level = createLevel({
    chapterIds: [chapter.universalRef],
    ref: 'mod_1'
  });
  const firstDiscipline = createDiscipline({
    ref: 'dis_1',
    name: 'Fake discipline',
    levels: [level]
  });

  return {
    getItem: (type, language, ref) => {
      if (ref === 'void_ref') {
        return Promise.resolve(undefined);
      }
      if (type === 'ref_exception') {
        return Promise.reject(utils.fakeError);
      }

      return Promise.resolve({foo: 'bar'});
    },
    getItemsPerResourceType: type => Promise.resolve([firstDiscipline])
  };
});

describe('disciplines', () => {
  describe('find', () => {
    const {find} = require('./disciplines');

    it('should find discipline', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')('ref_discipline');
      expect(result).toEqual({foo: 'bar'});
    });

    it('should handle exception', () => {
      // $FlowFixMe this is only to test
      const result = find('en')('ref_exception');
      expect(result).rejects.toThrow(fakeError);
    });

    it('should return undefined', async () => {
      // $FlowFixMe this is only to test
      const result = await find('en')('void_ref');
      expect(result).not.toBeDefined();
    });
  });

  describe('findByLevel', () => {
    const {findByLevel} = require('./disciplines');

    it('should handle level without discipline', async () => {
      const result = await findByLevel('en')('dummyId');
      expect(result).toBeUndefined();
    });

    it('should find discipline', async () => {
      const result = await findByLevel('en')('mod_1');

      expect(result && result.universalRef).toEqual('dis_1');
    });
  });

  describe('findByChapter', () => {
    const {findByChapter} = require('./disciplines');

    it('should handle level without discipline', async () => {
      const result = await findByChapter('en')('dummyId');
      expect(result).toBeUndefined();
    });

    it('should find discipline', async () => {
      const result = await findByChapter('en')('cha_1');

      expect(result && result.universalRef).toEqual('dis_1');
    });
  });
});
