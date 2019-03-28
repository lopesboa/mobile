// @flow
import {AsyncStorage} from 'react-native';
import {createDisciplineCard, createCardLevel} from '../../__fixtures__/cards';
import {find, getNextLevel} from './recommendations';

describe('Recommendation data layer', () => {
  describe('find', () => {
    it('should be mocked', async () => {
      const actual = await find('type', 'ref');
      expect(actual).toEqual([]);
    });
  });
  describe('getNextLevel', () => {
    it('should return next level', async () => {
      const currentLevelCard = createCardLevel({
        ref: 'mod_current',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
        completion: 1
      });
      const nextLevelCard = createCardLevel({
        ref: 'mod_next',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
        completion: 0
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis_something',
        completion: 0.5,
        levels: [currentLevelCard, nextLevelCard],
        title: 'Second discipline'
      });
      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === 'card:en:mod_current') return Promise.resolve(JSON.stringify(disciplineCard));
        return Promise.resolve();
      });
      const actual = await getNextLevel('en')('mod_current');
      expect(actual && actual.universalRef).toEqual('dis_something');
    });
    it('should return none if all levels are complets', async () => {
      const disciplineCard = createDisciplineCard({
        ref: 'dis_something',
        completion: 1,
        levels: [
          createCardLevel({
            ref: 'mod_dirst',
            status: 'isActive',
            label: 'Fake level',
            level: 'advanced',
            completion: 1
          }),
          createCardLevel({
            ref: 'mod_second',
            status: 'isActive',
            label: 'Fake level',
            level: 'advanced',
            completion: 1
          })
        ],
        title: 'Second discipline'
      });
      AsyncStorage.getItem = jest.fn().mockImplementation(key => {
        if (key === 'card:en:mod_second') return Promise.resolve(JSON.stringify(disciplineCard));
        return Promise.resolve();
      });
      const actual = await getNextLevel('en')('mod_second');
      expect(actual).toBeUndefined();
    });
  });
});
