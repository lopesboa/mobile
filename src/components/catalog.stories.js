// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createSections} from '../__fixtures__/sections';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {createCatalogState} from '../__fixtures__/store';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress, TestContextProvider} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import Catalog from './catalog';

// This is for the loader
if (__TEST__) {
  jest.useFakeTimers();
}

const sections = createSections();
const sectionsWithCardsRef = sections.map((section, index) => ({
  ...section,
  cardsRef:
    (index === 0 && ['foo', 'bar']) ||
    (index === 1 && ['bar', 'foo']) ||
    (index === 2 && []) ||
    undefined
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
    <TestContextProvider store={{catalog: createCatalogState([], [])}}>
      <Catalog
        sections={[]}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Refreshing', () => (
    <TestContextProvider store={{catalog: createCatalogState([], [])}}>
      <Catalog
        sections={[]}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
        isRefreshing
      />
    </TestContextProvider>
  ))
  .add('Sections with cards', () => (
    <TestContextProvider
      store={{catalog: createCatalogState(sectionsWithCardsRef, [disciplineCard, chapterCard])}}
    >
      <Catalog
        sections={sectionsWithCardsRef}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Sections with bad card refs', () => (
    <TestContextProvider
      store={{
        catalog: createCatalogState(sectionsWithEmptyCardsRef, [disciplineCard, chapterCard])
      }}
    >
      <Catalog
        sections={sectionsWithEmptyCardsRef}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ));
