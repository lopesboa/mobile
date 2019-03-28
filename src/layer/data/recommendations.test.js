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
    it('should be mocked', async () => {
      const levelCard = createCardLevel({
        ref: 'mod_yeAh',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced'
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis_something',
        completion: 0,
        levels: [levelCard],
        title: 'Second discipline'
      });
      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(disciplineCard)));
      const actual = await getNextLevel('en')('mod_yeAh');
      expect('dis_something').toEqual(actual.universalRef);
    });
  });
});
