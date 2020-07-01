import * as React from 'react';
import renderer from 'react-test-renderer';

import {createSections} from '../__fixtures__/sections';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {createProgression} from '../__fixtures__/progression';
import {fakeLayout, handleFakePress, TestContextProvider} from '../utils/tests';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {Section} from '../types';
import {HEIGHT as SECTION_HEIGHT} from '../components/catalog-section';
import {HERO_HEIGHT, SEPARATOR_HEIGHT} from '../components/catalog';
import {Component as Catalog, mapStateToProps, DEBOUNCE_DURATION, DEFAULT_LIMIT} from './catalog';

import type {ConnectedStateProps} from './catalog';

jest.useFakeTimers();

const sections = createSections();
const sectionsWithCardsRef = sections.map((section, index) => ({
  ...section,
  cardsRef:
    (index === 0 && ['foo', 'bar', undefined]) ||
    (index === 1 && ['bar', 'foo']) ||
    (index === 2 && []) ||
    undefined,
}));
const chapterCard = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
});

describe('Catalog', () => {
  it('should fetch at mount', () => {
    const fetchSections = jest.fn();
    const fetchHero = jest.fn();
    renderer.create(
      <TestContextProvider>
        <Catalog
          sections={[]}
          onCardPress={handleFakePress}
          layout={fakeLayout}
          fetchSections={fetchSections}
          fetchHero={fetchHero}
          isFocused={false}
        />
      </TestContextProvider>,
    );

    expect(fetchSections).toHaveBeenCalledTimes(1);
    expect(fetchSections).toHaveBeenCalledWith(0, DEFAULT_LIMIT, false);
    expect(fetchHero).toHaveBeenCalledTimes(1);
  });

  describe('onScroll', () => {
    it('should fetch sections on scroll', () => {
      const fetchSections = jest.fn();
      const fetchHero = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef.concat([undefined]);
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
            fetchHero={fetchHero}
            isFocused={false}
          />
        </TestContextProvider>,
      );
      const catalog = component.root.find((el) => el.props.testID === 'catalog');
      let scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: HERO_HEIGHT + SEPARATOR_HEIGHT + SECTION_HEIGHT + SEPARATOR_HEIGHT - 1,
          },
        },
      };
      catalog.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);

      scrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: HERO_HEIGHT + SEPARATOR_HEIGHT + SECTION_HEIGHT + SEPARATOR_HEIGHT,
          },
        },
      };
      catalog.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchHero).toHaveBeenCalledTimes(1);
      expect(fetchSections).toHaveBeenCalledTimes(3);
      expect(fetchSections.mock.calls[0]).toEqual([0, 3, false]);
      expect(fetchSections.mock.calls[1]).toEqual([0, 3, false]);
      expect(fetchSections.mock.calls[2]).toEqual([1, 2, false]);
    });

    it('should handle scroll on sections already fetched', () => {
      const fetchSections = jest.fn();
      const fetchHero = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef;
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
            fetchHero={fetchHero}
            isFocused={false}
          />
        </TestContextProvider>,
      );
      const catalog = component.root.find((el) => el.props.testID === 'catalog');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: 1,
          },
        },
      };
      catalog.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchHero).toHaveBeenCalledTimes(1);
      expect(fetchSections).toHaveBeenCalledTimes(1);
      expect(fetchSections.mock.calls[0]).toEqual([0, 2, false]);
    });
  });

  describe('onRefresh', () => {
    it('should handle refresh', () => {
      const fetchSections = jest.fn();
      const fetchHero = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef;
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
            fetchHero={fetchHero}
            isFocused={false}
          />
        </TestContextProvider>,
      );
      const catalog = component.root.find((el) => el.props.testID === 'catalog');
      catalog.props.onRefresh();
      expect(fetchHero).toHaveBeenCalledTimes(1);
      expect(fetchSections).toHaveBeenCalledTimes(2);
      expect(fetchSections.mock.calls[0]).toEqual([0, 2, false]);
      expect(fetchSections.mock.calls[1]).toEqual([0, 2, true]);
    });
  });

  describe('onUpdate', () => {
    it('should fetchHero at componentDidUpdate', () => {
      const fetchSections = jest.fn();
      const fetchHero = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef;
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
            fetchHero={fetchHero}
            isFocused={false}
          />
        </TestContextProvider>,
      );
      component.update(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
            fetchHero={fetchHero}
            isFocused
          />
        </TestContextProvider>,
      );
      expect(fetchHero).toHaveBeenCalledTimes(2);
    });
  });

  describe('mapStateToProps', () => {
    const catalog = createCatalogState({
      heroRef: chapterCard.universalRef,
      sections: sectionsWithCardsRef.concat([undefined]),
      cards: [chapterCard],
    });

    it('should get all props', () => {
      const levelRef = 'dummyRef';
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: levelRef,
        },
      });

      const mockedStore = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        catalog,
      });

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        hero: chapterCard,
        sections: sectionsWithCardsRef.concat([undefined]),
      };

      expect(result).toEqual(expected);
    });
  });
});
