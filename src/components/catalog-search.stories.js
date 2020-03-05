// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress, fakeLayout} from '../utils/tests';
import {
  createCardLevel,
  createDisciplineCard,
  createChapterCard,
  createCardAuthor
} from '../__fixtures__/cards';
import {__TEST__} from '../modules/environment';
import {AUTHOR_TYPE} from '../const';
import {CARD_STATUS} from '../layer/data/_const';
import {Component as CatalogSearch} from './catalog-search';

const authorCard = createCardAuthor({authorType: AUTHOR_TYPE.CUSTOM});
const levelCard = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const firstCard = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card'
});
const secondCard = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  authors: [authorCard]
});
const thirdCard = createChapterCard({
  ref: 'baz',
  completion: 0,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  authors: [authorCard]
});
const fourthCard = createChapterCard({
  ref: 'qux',
  completion: 0.5,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  authors: [authorCard]
});
const emptyCards = new Array(30).fill();
const cards = [firstCard, secondCard, thirdCard, fourthCard].concat(emptyCards.slice(0, 26));

storiesOf('CatalogSearch', module)
  .add('Default', () => (
    <CatalogSearch onCardPress={handleFakePress} onScroll={handleFakePress} layout={fakeLayout} />
  ))
  .add('No results', () => (
    <CatalogSearch
      cards={[]}
      onCardPress={handleFakePress}
      onScroll={handleFakePress}
      layout={fakeLayout}
      testID="catalog-search-no-results"
    />
  ))
  .add('With cards', () => (
    <CatalogSearch
      cards={cards}
      onCardPress={handleFakePress}
      onScroll={handleFakePress}
      layout={fakeLayout}
      testID="catalog-search-with-cards"
    />
  ));

if (__TEST__) {
  describe('CatalogSearch', () => {
    it('should handle card press', () => {
      const handleCardPress = jest.fn();
      const component = renderer.create(
        <CatalogSearch cards={cards} onCardPress={handleCardPress} onScroll={handleFakePress} />
      );

      const catalogItem = component.root.find(
        el => el.props.testID === 'catalog-search-items-item-bar' && el.props.analyticsID === 'card'
      );
      catalogItem.props.onPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
      expect(handleCardPress).toHaveBeenCalledWith(secondCard);
    });
  });
}
