// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createChapterCard} from '../__fixtures__/cards';
import {fakeLayout, handleFakePress} from '../utils/tests';
import {CARD_STATUS} from '../layer/data/_const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {ITEM_WIDTH, ITEM_HEIGHT} from '../components/catalog-items';

const cardsRef = [
  'foo',
  'bar',
  'baz',
  'qux',
  'quux',
  'corge',
  'grault',
  'garply',
  'waldo',
  'fred',
  'plugh',
  'xyzzy'
];
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

describe('CatalogItems', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
  });

  describe('getOffset', () => {
    it('should get initial offset', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getOffset(undefined, ITEM_WIDTH - 1);
      const expected = 0;

      expect(result).toEqual(expected);
    });

    it('should get next item offset', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getOffset(undefined, ITEM_WIDTH);
      const expected = 1;

      expect(result).toEqual(expected);
    });

    it('should get initial offset (with columns)', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getOffset(2, ITEM_HEIGHT - 1);
      const expected = 0;

      expect(result).toEqual(expected);
    });

    it('should get next row offset (with columns)', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getOffset(2, ITEM_HEIGHT);
      const expected = 2;

      expect(result).toEqual(expected);
    });
  });

  describe('getLimit', () => {
    it('should get default limit', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getLimit(undefined);
      const expected = 5;

      expect(result).toEqual(expected);
    });

    it('should get limit', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getLimit(undefined, fakeLayout);
      const expected = 3;

      expect(result).toEqual(expected);
    });

    it('should get default limit (with columns)', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getLimit(2);
      const expected = 10;

      expect(result).toEqual(expected);
    });

    it('should get limit (with columns)', () => {
      const {Component: CatalogItems} = require('./catalog-items');

      const result = CatalogItems.getLimit(3, fakeLayout);
      const expected = 15;

      expect(result).toEqual(expected);
    });
  });

  describe('onScroll', () => {
    it('should trigger onScroll', () => {
      const {Component: CatalogItems, DEBOUNCE_DURATION} = require('./catalog-items');

      const handleScroll = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards
        .slice(0, 2)
        .concat([undefined, undefined, undefined, undefined]);

      const component = renderer.create(
        <CatalogItems
          cards={_cards}
          onCardPress={handleFakePress}
          onScroll={handleScroll}
          layout={fakeLayout}
        />
      );
      const list = component.root.find(el => el.props.testID === 'catalog-items');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            x: ITEM_WIDTH
          }
        }
      };
      list.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(handleScroll).toHaveBeenCalledTimes(1);
      expect(handleScroll).toHaveBeenCalledWith(1, 3);
    });

    it('should not trigger onScroll on defined cards', () => {
      const {Component: CatalogItems, DEBOUNCE_DURATION} = require('./catalog-items');

      const handleScroll = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards
        .slice(0, 5)
        .concat([undefined]);

      const component = renderer.create(
        <CatalogItems
          cards={_cards}
          onCardPress={handleFakePress}
          onScroll={handleScroll}
          layout={fakeLayout}
        />
      );
      const list = component.root.find(el => el.props.testID === 'catalog-items');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            x: ITEM_WIDTH
          }
        }
      };
      list.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(handleScroll).toHaveBeenCalledTimes(0);
    });

    it('should trigger onScroll (with columns)', () => {
      const {Component: CatalogItems, DEBOUNCE_DURATION} = require('./catalog-items');

      const handleScroll = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards
        .slice(0, 4)
        .concat([undefined, undefined, undefined, undefined]);

      const component = renderer.create(
        <CatalogItems
          cards={_cards}
          numColumns={2}
          onCardPress={handleFakePress}
          onScroll={handleScroll}
          layout={fakeLayout}
        />
      );
      const list = component.root.find(el => el.props.testID === 'catalog-items');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: ITEM_HEIGHT
          }
        }
      };
      list.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(handleScroll).toHaveBeenCalledTimes(1);
      expect(handleScroll).toHaveBeenCalledWith(2, 10);
    });

    it('should not trigger onScroll on defined cards (with columns)', () => {
      const {Component: CatalogItems, DEBOUNCE_DURATION} = require('./catalog-items');

      const handleScroll = jest.fn();
      const _cards: Array<DisciplineCard | ChapterCard | void> = cards
        .slice(0, 12)
        .concat([undefined]);

      const component = renderer.create(
        <CatalogItems
          cards={_cards}
          numColumns={2}
          onCardPress={handleFakePress}
          onScroll={handleScroll}
          layout={fakeLayout}
        />
      );
      const list = component.root.find(el => el.props.testID === 'catalog-items');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: ITEM_HEIGHT
          }
        }
      };
      list.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(handleScroll).toHaveBeenCalledTimes(0);
    });
  });

  it('should handle onScrollBeginDrag', () => {
    const {Keyboard} = require('react-native');

    Keyboard.dismiss = jest.fn();

    const {Component: CatalogItems} = require('./catalog-items');

    const component = renderer.create(
      <CatalogItems onCardPress={handleFakePress} onScroll={handleFakePress} />
    );

    const list = component.root.find(el => el.props.testID === 'catalog-items');
    list.props.onScrollBeginDrag();

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
