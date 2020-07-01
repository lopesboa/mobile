import * as React from 'react';
import renderer from 'react-test-renderer';

import {handleFakePress} from '../utils/tests';
import {createChapterCard} from '../__fixtures__/cards';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {CARD_STATUS} from '../layer/data/_const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {ENGINE, CONTENT_TYPE} from '../const';
import {Component as CatalogSearch} from './catalog-search';
import type {ConnectedStateProps} from './catalog-search';

jest.useFakeTimers();

const cardsRef = ['foo', 'bar', 'baz', 'qux', 'quux', undefined];
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

describe('CatalogSearch', () => {
  describe('onScroll', () => {
    it('should fetch cards on scroll', () => {
      const searchValue = 'foo';
      const offset = 2;
      const limit = 6;
      const queryParams = {};
      const fetchCards = jest.fn();
      const component = renderer.create(
        <CatalogSearch
          searchValue={searchValue}
          searchParams={queryParams}
          cards={cards}
          onCardPress={handleFakePress}
          fetchCards={fetchCards}
        />,
      );
      const items = component.root.find((el) => el.props.testID === 'catalog-search-items');
      items.props.onScroll(offset, limit);
      expect(fetchCards).toHaveBeenCalledTimes(1);
      expect(fetchCards).toHaveBeenCalledWith(searchValue, offset, limit, queryParams);
    });
  });

  describe('mapStateToProps', () => {
    const catalog = createCatalogState({cards});

    it('should get all props', () => {
      const {mapStateToProps} = require('./catalog-search');

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
        cards,
      };

      expect(result).toEqual(expected);
    });
  });
});
