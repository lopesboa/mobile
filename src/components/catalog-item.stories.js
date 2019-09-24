// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createChapterCard, createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import CatalogItem from './catalog-item';

const levelCard = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card',
  isAdaptive: true,
  isNew: true
});
const chapterCard = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  isAdaptive: true
});

storiesOf('CatalogItem', module)
  .add('Default', () => <CatalogItem />)
  .add('Default (cover)', () => <CatalogItem size="cover" />)
  .add('With chapter', () => <CatalogItem item={chapterCard} />)
  .add('With chapter (cover)', () => <CatalogItem size="cover" item={chapterCard} />)
  .add('With discipline', () => <CatalogItem item={disciplineCard} />)
  .add('With discipline (cover)', () => <CatalogItem size="cover" item={disciplineCard} />);

if (__TEST__) {
  describe('CatalogItem', () => {
    it('should not handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(<CatalogItem onPress={handlePress} />);

      const catalogItem = component.root.find(
        el => el.props.testID === 'catalog-item' && el.props.analyticsID === 'card'
      );
      catalogItem.props.onPress();

      expect(handlePress).toHaveBeenCalledTimes(0);
    });

    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const item = chapterCard;
      const component = renderer.create(<CatalogItem item={item} onPress={handlePress} />);

      const catalogItem = component.root.find(
        el => el.props.testID === 'catalog-item' && el.props.analyticsID === 'card'
      );
      catalogItem.props.onPress();

      expect(handlePress).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalledWith(item);
    });
  });
}
