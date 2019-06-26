// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {createSections} from '../__fixtures__/sections';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import Catalog from './catalog';

// This is for the loader
if (__TEST__) {
  jest.useFakeTimers();
}

const sections = createSections();
const sectionsWithCardsRef = sections.map((section, index) => ({
  ...section,
  cardsRef: (index === 0 && ['foo']) || (index === 1 && ['bar']) || (index === 2 && []) || undefined
}));
const sectionsWithEmptyCardsRef = sections.map((section, index) => ({
  ...section,
  cardsRef: []
}));

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'foo',
  completion: 0,
  levels: [level],
  title: 'Fake discipline'
});
const chapterCard = createChapterCard({
  ref: 'bar',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE
});

storiesOf('Catalog', module)
  .add('Default', () => (
    <Catalog
      sections={[]}
      cards={[]}
      onCardPress={handleFakePress}
      onRefresh={handleFakePress}
      onCardsScroll={handleFakePress}
      onScroll={handleFakePress}
    />
  ))
  .add('Refreshing', () => (
    <Catalog
      sections={[]}
      cards={[]}
      onCardPress={handleFakePress}
      onRefresh={handleFakePress}
      onCardsScroll={handleFakePress}
      onScroll={handleFakePress}
      isRefreshing
    />
  ))
  .add('Sections with cards', () => (
    <Catalog
      sections={sectionsWithCardsRef}
      cards={[disciplineCard, chapterCard]}
      onCardPress={handleFakePress}
      onRefresh={handleFakePress}
      onCardsScroll={handleFakePress}
      onScroll={handleFakePress}
    />
  ))
  .add('Sections with bad card refs', () => (
    <Catalog
      sections={sectionsWithEmptyCardsRef}
      cards={[disciplineCard, chapterCard]}
      onCardPress={handleFakePress}
      onRefresh={handleFakePress}
      onCardsScroll={handleFakePress}
      onScroll={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('Catalog', () => {
    it('should handle scroll', () => {
      const handleCardsScroll = jest.fn();
      const component = renderer.create(
        <Catalog
          sections={sectionsWithCardsRef}
          cards={[disciplineCard, chapterCard]}
          onCardPress={handleFakePress}
          onRefresh={handleFakePress}
          onCardsScroll={handleCardsScroll}
          onScroll={handleFakePress}
        />
      );
      const firstSection = sectionsWithCardsRef[0];
      const catalogSection = component.root.find(
        // $FlowFixMe from fixtures
        el => el.props.testID === `catalog-section-${firstSection.key}`
      );
      catalogSection.props.onScroll(500, 3);
      expect(handleCardsScroll.mock.calls.length).toBe(1);
      expect(handleCardsScroll.mock.calls[0]).toEqual([firstSection, 500, 3]);
    });
  });
}
