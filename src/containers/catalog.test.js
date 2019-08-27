// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createSections} from '../__fixtures__/sections';
import {createCatalogState, createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {fakeLayout, handleFakePress, TestContextProvider} from '../utils/tests';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {Section} from '../types';
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
    undefined
}));

describe('Catalog', () => {
  it('should fetch at mount', () => {
    const fetchSections = jest.fn();
    renderer.create(
      <TestContextProvider>
        <Catalog
          sections={[]}
          onCardPress={handleFakePress}
          layout={fakeLayout}
          fetchSections={fetchSections}
        />
      </TestContextProvider>
    );

    expect(fetchSections).toHaveBeenCalledTimes(1);
    expect(fetchSections).toHaveBeenCalledWith(0, DEFAULT_LIMIT, false);
  });

  describe('onScroll', () => {
    it('should fetch sections on scroll', () => {
      const fetchSections = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef.concat([undefined]);
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
          />
        </TestContextProvider>
      );
      const catalog = component.root.find(el => el.props.testID === 'catalog');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: 580
          }
        }
      };
      catalog.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchSections).toHaveBeenCalledTimes(2);
      expect(fetchSections.mock.calls[0]).toEqual([0, 3, false]);
      expect(fetchSections.mock.calls[1]).toEqual([2, 1, false]);
    });

    it('should handle scroll on sections already fetched', () => {
      const fetchSections = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef;
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
          />
        </TestContextProvider>
      );
      const catalog = component.root.find(el => el.props.testID === 'catalog');
      const scrollEvent: ScrollEvent = {
        nativeEvent: {
          contentOffset: {
            y: 1
          }
        }
      };
      catalog.props.onScroll(scrollEvent);
      jest.advanceTimersByTime(DEBOUNCE_DURATION);
      expect(fetchSections).toHaveBeenCalledTimes(1);
      expect(fetchSections.mock.calls[0]).toEqual([0, 2, false]);
    });
  });

  describe('onRefresh', () => {
    it('should handle refresh', () => {
      const fetchSections = jest.fn();
      const _sections: Array<Section | void> = sectionsWithCardsRef;
      const component = renderer.create(
        <TestContextProvider>
          <Catalog
            sections={_sections}
            onCardPress={handleFakePress}
            layout={fakeLayout}
            fetchSections={fetchSections}
          />
        </TestContextProvider>
      );
      const catalog = component.root.find(el => el.props.testID === 'catalog');
      catalog.props.onRefresh();
      expect(fetchSections).toHaveBeenCalledTimes(2);
      expect(fetchSections.mock.calls[0]).toEqual([0, 2, false]);
      expect(fetchSections.mock.calls[1]).toEqual([0, 2, true]);
    });
  });

  describe('mapStateToProps', () => {
    const catalog = createCatalogState(sectionsWithCardsRef.concat([undefined]), []);

    it('should get all props', () => {
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
        sections: sectionsWithCardsRef.concat([undefined])
      };

      expect(result).toEqual(expected);
    });
  });
});
