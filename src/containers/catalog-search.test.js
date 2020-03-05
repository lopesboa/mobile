// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {handleFakePress} from '../utils/tests';
import {createChapterCard} from '../__fixtures__/cards';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {CARD_STATUS} from '../layer/data/_const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {ConnectedStateProps} from './catalog-search';

jest.useFakeTimers();

const cardsRef = ['foo', 'bar', 'baz', 'qux', 'quux', undefined];
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

describe('CatalogSearch', () => {
  beforeEach(() => {
    jest.resetModules();
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

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        cards
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle onScrollBeginDrag', () => {
    const {Keyboard} = require('react-native');

    Keyboard.dismiss = jest.fn();

    const {Component: CatalogSearch} = require('./catalog-search');

    const component = renderer.create(<CatalogSearch onCardPress={handleFakePress} />);

    const list = component.root.find(el => el.props.testID === 'catalog-search');
    list.props.onScrollBeginDrag();

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
