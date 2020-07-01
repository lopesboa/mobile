import {fakeError} from '../../utils/tests';

jest.mock('./core', () => {
  const utils = require('../../utils/tests');
  const {createChapter} = require('../../__fixtures__/chapters');
  const {createDiscipline} = require('../../__fixtures__/disciplines');
  const {createLevel} = require('../../__fixtures__/levels');

  const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
  const level = createLevel({
    chapterIds: [chapter.universalRef],
    ref: 'mod_1',
  });
  const firstDiscipline = createDiscipline({
    ref: 'dis_1',
    name: 'Fake discipline',
    levels: [level],
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
    getItemsPerResourceType: (type) => Promise.resolve([firstDiscipline]),
  };
});

describe('disciplines', () => {
  describe('find', () => {
    const {find} = require('./disciplines');

    it('should find discipline', async () => {
      // @ts-ignore this is only to test
      const result = await find('ref_discipline');
      expect(result).toEqual({foo: 'bar'});
    });

    it('should handle exception', () => {
      // @ts-ignore this is only to test
      const result = find('ref_exception');
      expect(result).rejects.toThrow(fakeError);
    });

    it('should return undefined', async () => {
      // @ts-ignore this is only to test
      const result = await find('void_ref');
      expect(result).not.toBeDefined();
    });
  });

  describe('findByLevel', () => {
    const {findByLevel} = require('./disciplines');

    it('should handle level without discipline', async () => {
      const result = await findByLevel('dummyId');
      expect(result).toBeUndefined();
    });

    it('should find discipline', async () => {
      const result = await findByLevel('mod_1');

      expect(result && result.universalRef).toEqual('dis_1');
    });
  });

  describe('findByChapter', () => {
    const {findByChapter} = require('./disciplines');

    it('should handle level without discipline', async () => {
      const result = await findByChapter('dummyId');
      expect(result).toBeUndefined();
    });

    it('should find discipline', async () => {
      const result = await findByChapter('cha_1');

      expect(result && result.universalRef).toEqual('dis_1');
    });
  });
});
