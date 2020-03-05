// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {createSections} from '../__fixtures__/sections';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {createCatalogState, createAuthenticationState} from '../__fixtures__/store';
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
    <TestContextProvider
      store={{
        catalog: createCatalogState({}),
        authentication: createAuthenticationState({user: null, brand: null})
      }}
    >
      <Catalog
        sections={[]}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('User connected', () => (
    <TestContextProvider
      store={{
        catalog: createCatalogState({})
      }}
    >
      <Catalog
        sections={[]}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('With hero', () => (
    <TestContextProvider
      store={{
        catalog: createCatalogState({
          sections: sectionsWithCardsRef,
          cards: [disciplineCard, chapterCard]
        })
      }}
    >
      <Catalog
        hero={chapterCard}
        sections={sectionsWithCardsRef}
        onCardPress={handleFakePress}
        onRefresh={handleFakePress}
        onScroll={handleFakePress}
      />
    </TestContextProvider>
  ))
  .add('Refreshing', () => (
    <TestContextProvider store={{catalog: createCatalogState({})}}>
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
      store={{
        catalog: createCatalogState({
          sections: sectionsWithCardsRef,
          cards: [disciplineCard, chapterCard]
        })
      }}
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
        catalog: createCatalogState({
          sections: sectionsWithEmptyCardsRef,
          cards: [disciplineCard, chapterCard]
        })
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

if (__TEST__) {
  describe('Catalog', () => {
    it('should handle hero onPress callback', () => {
      const handleCardPress = jest.fn();
      const hero = chapterCard;
      const component = renderer.create(
        <TestContextProvider
          store={{
            catalog: createCatalogState({
              sections: sectionsWithCardsRef,
              cards: [disciplineCard, chapterCard]
            })
          }}
        >
          <Catalog
            hero={hero}
            sections={sectionsWithCardsRef}
            onCardPress={handleCardPress}
            onRefresh={handleFakePress}
            onScroll={handleFakePress}
          />
        </TestContextProvider>
      );

      const button = component.root.find(el => el.props.testID === 'catalog-hero-button');
      button.props.onPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
      expect(handleCardPress).toHaveBeenCalledWith(hero);
    });

    it('should handle card onPress callback', () => {
      const handleCardPress = jest.fn();
      const component = renderer.create(
        <TestContextProvider
          store={{
            catalog: createCatalogState({
              sections: sectionsWithCardsRef,
              cards: [disciplineCard, chapterCard]
            })
          }}
        >
          <Catalog
            sections={sectionsWithCardsRef}
            onCardPress={handleCardPress}
            onRefresh={handleFakePress}
            onScroll={handleFakePress}
          />
        </TestContextProvider>
      );

      const button = component.root.find(
        el =>
          el.props.testID === 'catalog-section-most-popular-items-item-bar' &&
          el.props.analyticsID === 'card'
      );
      button.props.onPress();

      expect(handleCardPress).toHaveBeenCalledTimes(1);
      expect(handleCardPress).toHaveBeenCalledWith(chapterCard);
    });
  });
}
