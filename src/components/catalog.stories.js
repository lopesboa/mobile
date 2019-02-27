// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress} from '../utils/tests';
import Catalog from './catalog';

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const discipline = createDisciplineCard({
  ref: 'dis_1',
  completion: 0,
  levels: [level],
  title: 'Fake discipline'
});
const chapter = createChapterCard({
  ref: 'cha_1',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE
});

storiesOf('Catalog', module).add('Default', () => (
  <Catalog items={[discipline, chapter]} onPress={handleFakePress} />
));

if (process.env.NODE_ENV === 'test') {
  describe('Catalog', () => {
    it('should handle onItemPress callback on discipline', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <Catalog items={[discipline, chapter]} onPress={handlePress} />
      );
      const catalogItem = component.root.find(el => el.props.testID === 'catalog-item-dis-1');
      catalogItem.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([discipline]);
    });

    it('should handle onItemPress callback on chapter', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <Catalog items={[discipline, chapter]} onPress={handlePress} />
      );
      const catalogItem = component.root.find(el => el.props.testID === 'catalog-item-cha-1');
      catalogItem.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([chapter]);
    });
  });
}
