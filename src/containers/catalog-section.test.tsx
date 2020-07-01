import * as React from 'react';
import renderer from 'react-test-renderer';

import {handleFakePress} from '../utils/tests';
import {createSections} from '../__fixtures__/sections';
import {createChapterCard} from '../__fixtures__/cards';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {CARD_STATUS} from '../layer/data/_const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {ENGINE, CONTENT_TYPE} from '../const';
import {Component as CatalogSection, mapStateToProps} from './catalog-section';
import type {ConnectedStateProps, OwnProps} from './catalog-section';

jest.useFakeTimers();

const cardsRef = ['foo', 'bar', 'baz', 'qux', 'quux'];
const cards: Array<DisciplineCard | ChapterCard | void> = cardsRef.map(
  (ref) =>
    ref &&
    createChapterCard({
      ref,
      completion: 0,
      title: 'Fake chapter',
      status: CARD_STATUS.ACTIVE,
    }),
);

describe('CatalogSection', () => {
  describe('onScroll', () => {
    it('should fetch cards on scroll', () => {
      const sectionRef = 'foo';
      const offset = 2;
      const limit = 3;
      const fetchCards = jest.fn();
      const component = renderer.create(
        <CatalogSection
          sectionRef={sectionRef}
          cards={[]}
          onCardPress={handleFakePress}
          fetchCards={fetchCards}
          testID={`catalog-section-${sectionRef}`}
        />,
      );
      const items = component.root.find(
        (el) => el.props.testID === `catalog-section-${sectionRef}-items`,
      );
      items.props.onScroll(offset, limit);
      expect(fetchCards).toHaveBeenCalledTimes(1);
      expect(fetchCards).toHaveBeenCalledWith(sectionRef, offset, limit);
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
        undefined,
    }));
    const catalog = createCatalogState({sections: sectionsWithCardsRef, cards});

    it('should get all props', () => {
      const sectionRef = sections[0].key;
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

      const props: OwnProps = {sectionRef, testID: 'foobar'};
      const result = mapStateToProps(mockedStore, props);
      const expected: ConnectedStateProps = {
        cards: cards.slice(0, 2).concat([undefined]),
      };

      expect(result).toEqual(expected);
    });
  });
});
