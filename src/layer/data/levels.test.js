// @flow strict

import {mapToLevelAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const {createLevel} = require('../../__fixtures__/levels');

  const firstLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_1'
  });
  const secondLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_2'
  });

  return {
    getItem: (type, language, ref) => Promise.resolve(ref === 'mod_1' ? firstLevel : secondLevel)
  };
});

jest.mock('./disciplines', () => {
  const {createLevel} = require('../../__fixtures__/levels');
  const {createDiscipline} = require('../../__fixtures__/disciplines');

  const firstLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_1'
  });
  const secondLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_2'
  });
  const firstDiscipline = createDiscipline({
    ref: 'dis_1',
    name: 'Fake discipline',
    levels: [firstLevel, secondLevel]
  });

  return {
    findByLevel: ref => Promise.resolve(ref !== 'mod_foo' ? firstDiscipline : undefined)
  };
});

describe('levels', () => {
  describe('findById', () => {
    const {findById} = require('./levels');

    it('should return level', async () => {
      const result = await findById('mod_1');
      expect(result).toEqual(mapToLevelAPIExpectedResult);
    });
  });

  describe('getNextLevel', () => {
    const {getNextLevel} = require('./levels');

    it('should handle level without discipline', async () => {
      const result = await getNextLevel('mod_foo');
      expect(result).toBeUndefined();
    });

    it('should handle last level', async () => {
      const result = await getNextLevel('mod_2');
      expect(result).toBeUndefined();
    });

    it('should get next level', async () => {
      const result = await getNextLevel('mod_1');
      const expected = {
        ...mapToLevelAPIExpectedResult,
        _id: 'id_mod_2',
        universalRef: 'mod_2',
        ref: 'mod_2'
      };

      expect(result).toEqual(expected);
    });
  });
});
