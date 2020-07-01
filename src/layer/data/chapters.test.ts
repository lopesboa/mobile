import {mapToChapterAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const {createChapter} = require('../../__fixtures__/chapters');

  const firstChapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});
  const secondChapter = createChapter({ref: 'cha_2', name: 'Fake chapter'});

  return {
    getItemsPerResourceType: () => Promise.resolve([firstChapter, secondChapter]),
    getItem: (type, language, ref) =>
      Promise.resolve(ref === 'cha_1' ? firstChapter : secondChapter),
  };
});

jest.mock('./disciplines', () => {
  const {createLevel} = require('../../__fixtures__/levels');
  const {createDiscipline} = require('../../__fixtures__/disciplines');

  const firstLevel = createLevel({
    chapterIds: ['cha_1', 'cha_2'],
    ref: 'mod_1',
  });
  const firstDiscipline = createDiscipline({
    ref: 'dis_1',
    name: 'Fake discipline',
    levels: [firstLevel],
  });

  return {
    findByChapter: (ref) => Promise.resolve(ref !== 'cha_foo' ? firstDiscipline : undefined),
  };
});

describe('chapters', () => {
  describe('find', () => {
    const {find} = require('./chapters');

    it('should return all chapters', async () => {
      const result = await find();
      expect(result).toEqual([
        mapToChapterAPIExpectedResult,
        {...mapToChapterAPIExpectedResult, _id: 'cha_2', universalRef: 'cha_2'},
      ]);
    });
  });

  describe('findById', () => {
    const {findById} = require('./chapters');

    it('should return chapter', async () => {
      const result = await findById('cha_1');
      expect(result).toEqual(mapToChapterAPIExpectedResult);
    });
  });

  describe('getNextChapter', () => {
    const {getNextChapter} = require('./chapters');

    it('should handle chapter without discipline', async () => {
      const result = await getNextChapter('cha_foo');
      expect(result).toBeUndefined();
    });

    it('should handle last chapter', async () => {
      const result = await getNextChapter('cha_2');
      expect(result).toBeUndefined();
    });

    it('should get next chapter', async () => {
      const result = await getNextChapter('cha_1');
      const expected = {...mapToChapterAPIExpectedResult, _id: 'cha_2', universalRef: 'cha_2'};

      expect(result).toEqual(expected);
    });
  });
});
