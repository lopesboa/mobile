// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createSections} from '../__fixtures__/sections';
import {createChapterCard} from '../__fixtures__/cards';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {fakeLayout, handleFakePress} from '../utils/tests';
import {CARD_STATUS} from '../layer/data/_const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {ENGINE, CONTENT_TYPE} from '../const';
import {
  Component as CatalogSectionRefreshable,
  mapStateToProps,
  DEBOUNCE_DURATION
} from './catalog-section-refreshable';
import type {ConnectedStateProps, OwnProps} from './catalog-section-refreshable';

jest.useFakeTimers();

const cardsRef = ['foo', 'bar', 'baz', 'qux', 'quux'];
const cards: Array<DisciplineCard | ChapterCard | void> = cardsRef.map(
  ref =>
    ref &&
    createChapterCard({
      ref,
      completion: 0,
      title: 'Fake chapter',
      status: CARD_STATUS.ACTIVE
    })
);

describe('CatalogSectionRefreshable', () => {
  describe('onScroll', () => {
    it('should fetch cards on scroll', () => {
      const sectionRef = 'foo';
      const fetchCards = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards
        .slice(0, 2)
        .concat([undefined, undefined, undefined, undefined]);
      const component = renderer.create(
        <CatalogSectionRefreshable
          sectionRef={sectionRef}
          cards={_cards}
          onCardPress={handleFakePress}
          layout={fakeLayout}
          fetchCards={fetchCards}
          testID={`catalog-section-${sectionRef}`}
        />
      );
      const catalogSection = component.root.find(
        el => el.props.testID === `catalog-section-${sectionRef}-items`
      );
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            x: 453
          }
        }
      };
      catalogSection.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchCards).toHaveBeenCalledTimes(1);
      expect(fetchCards).toHaveBeenCalledWith(sectionRef, 2, 3);
    });

    it('should handle scroll on cards already fetched', () => {
      const sectionRef = 'baz';
      const fetchCards = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards.concat([undefined]);
      const component = renderer.create(
        <CatalogSectionRefreshable
          sectionRef={sectionRef}
          cards={_cards}
          onCardPress={handleFakePress}
          layout={fakeLayout}
          fetchCards={fetchCards}
          testID={`catalog-section-${sectionRef}`}
        />
      );
      const catalogSection = component.root.find(
        el => el.props.testID === `catalog-section-${sectionRef}-items`
      );
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            x: 453
          }
        }
      };
      catalogSection.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchCards).toHaveBeenCalledTimes(0);
    });
  });

  describe('mapStateToProps', () => {
    const sections = createSections();
    const sectionsWithCardsRef = sections.map((section, index) => ({
      ...section,
      cardsRef:
        (index === 0 && ['foo', 'bar', undefined]) ||
        (index === 1 && ['bar', 'foo']) ||
        (index === 2 && []) ||
        undefined
    }));
    const catalog = createCatalogState({sections: sectionsWithCardsRef, cards});

    it('should get all props', () => {
      const sectionRef = sections[0].key;
      const levelRef = 'dummyRef';
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: levelRef
        }
      });

      const mockedStore = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
        catalog
      });

      const props: OwnProps = {sectionRef, testID: 'foobar'};
      const result = mapStateToProps(mockedStore, props);
      const expected: ConnectedStateProps = {
        cards: cards.slice(0, 2).concat([undefined])
      };

      expect(result).toEqual(expected);
    });
  });
});
