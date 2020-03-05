// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {
  createCardLevel,
  createDisciplineCard,
  createChapterCard,
  createCardAuthor
} from '../__fixtures__/cards';
import {__TEST__} from '../modules/environment';
import {AUTHOR_TYPE} from '../const';
import {CARD_STATUS} from '../layer/data/_const';
import CatalogSection from './catalog-section';

const authorCard = createCardAuthor({authorType: AUTHOR_TYPE.CUSTOM});
const levelCard = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card'
});
const chapterCard = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  authors: [authorCard]
});
const cards = new Array(30).fill();

storiesOf('CatalogSection', module)
  .add('Default', () => <CatalogSection testID="fake-catalog-section" />)
  .add('Empty cards', () => (
    <CatalogSection
      sectionRef="default"
      cards={cards}
      onCardPress={handleFakePress}
      onScroll={handleFakePress}
      testID="fake-catalog-section"
    />
  ))
  .add('With content', () => (
    <CatalogSection
      sectionRef="withsomecards"
      title="Some content"
      cards={[disciplineCard, chapterCard].concat(cards.slice(0, 28))}
      onCardPress={handleFakePress}
      onScroll={handleFakePress}
      testID="fake-catalog-section"
    />
  ));

if (__TEST__) {
  describe('CatalogSection', () => {
    it('should handle press', () => {
      const handleCardPress = jest.fn();
      const component = renderer.create(
        <CatalogSection
          sectionRef="foobarbaz"
          title="Some content"
          cards={[disciplineCard, chapterCard].concat(cards.slice(0, 28))}
          onCardPress={handleCardPress}
          onScroll={handleFakePress}
          testID="fake-catalog-section"
        />
      );

      const catalogItem = component.root.find(
        el =>
          el.props.testID === 'catalog-section-foobarbaz-items-item-bar' &&
          el.props.analyticsID === 'card'
      );
      catalogItem.props.onPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
      expect(handleCardPress).toHaveBeenCalledWith(chapterCard);
    });
  });
}
