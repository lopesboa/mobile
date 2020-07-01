import type {LevelAPI} from '@coorpacademy/player-services';
import {createLevelAPI} from '../../__fixtures__/levels';
import {mapToLevelAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const {createLevel} = require('../../__fixtures__/levels');

  const firstLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_1',
  });
  const secondLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_2',
  });

  return {
    getItem: (type, language, ref) => Promise.resolve(ref === 'mod_1' ? firstLevel : secondLevel),
  };
});

jest.mock('./disciplines', () => {
  const {createLevel} = require('../../__fixtures__/levels');
  const {createDiscipline} = require('../../__fixtures__/disciplines');

  const firstLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_1',
  });
  const secondLevel = createLevel({
    chapterIds: ['cha_1'],
    ref: 'mod_2',
  });
  const firstDiscipline = createDiscipline({
    ref: 'dis_1',
    name: 'Fake discipline',
    levels: [firstLevel, secondLevel],
  });

  return {
    findByLevel: (ref) => Promise.resolve(ref !== 'mod_foo' ? firstDiscipline : undefined),
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
        ref: 'mod_2',
      };

      expect(result).toEqual(expected);
    });
  });

  describe('fetchLevel', () => {
    const host = 'https://domain.tld';
    const ref = 'tourte';
    const fakeLevelApi = createLevelAPI({
      ref,
      chapterIds: [],
      bestScore: 666,
      level: 'base',
    });

    beforeEach(() => {
      jest.resetModules();

      jest.mock('../../modules/environment', () => ({
        __E2E__: false,
      }));

      const fetch = require('cross-fetch');

      fetch.mockImplementationOnce(
        (
          url,
          options,
        ): Promise<{
          json: () => Promise<LevelAPI>;
        }> => {
          expect(url).toBe(`${host}/api/v2/levels/${ref}`);
          return Promise.resolve({
            json: () => Promise.resolve(fakeLevelApi),
          });
        },
      );

      jest.mock('../../utils/local-token', () => {
        const {createToken} = require('../../__fixtures__/tokens');
        return {
          get: jest.fn(() => Promise.resolve(createToken({}))),
        };
      });
    });
    it('should return a levelApi', async () => {
      const {fetchLevel} = require('./levels');
      const result = await fetchLevel(ref);
      expect(result.disciplineRef).toEqual(fakeLevelApi.disciplineRef);
    });

    it('should return throw error', async () => {
      const localToken = require('../../utils/local-token');
      // @ts-ignore this function is mocked;
      localToken.get.mockImplementationOnce(() => Promise.resolve(null));

      const {fetchLevel} = require('./levels');
      const fetching = fetchLevel(ref);
      await expect(fetching).rejects.toThrow(new Error('Invalid token'));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
