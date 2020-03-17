// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {TestContextProvider} from '../utils/tests';
import {ENGINE, CONTENT_TYPE} from '../const';
import {DEFAULT_LIMIT} from '../redux/actions/catalog/cards/fetch/search';

jest.useFakeTimers();

describe('Search', () => {
  describe('mapStateToProps', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./search');

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
        progression
      });

      const props = mapStateToProps(mockedStore);
      const expectedResult = {
        isSearchFetching: false
      };
      expect(props).toEqual(expectedResult);
    });
  });

  it('should handle onSearchInputChange', () => {
    const {Component: Search, SEARCH_DEBOUNCE_DURATION} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();

    const component = renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
        />
      </TestContextProvider>
    );

    const searchInput = component.root.find(el => el.props.testID === 'search-input');
    searchInput.props.onChange('f');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    searchInput.props.onChange('fo');
    searchInput.props.onChange('foo');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    searchInput.props.onChange('foob');
    searchInput.props.onChange('fooba');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    searchInput.props.onChange('foobar');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    searchInput.props.onChange('');

    expect(editSearch).toHaveBeenCalledTimes(7);
    expect(editSearch).toHaveBeenCalledWith('f');
    expect(editSearch).toHaveBeenCalledWith('fo');
    expect(editSearch).toHaveBeenCalledWith('foo');
    expect(editSearch).toHaveBeenCalledWith('foob');
    expect(editSearch).toHaveBeenCalledWith('fooba');
    expect(editSearch).toHaveBeenCalledWith('foobar');
    expect(editSearch).toHaveBeenCalledWith('');

    expect(fetchCards).toHaveBeenCalledTimes(3);
    expect(fetchCards).toHaveBeenCalledWith('foo', 0, DEFAULT_LIMIT, true);
    expect(fetchCards).toHaveBeenCalledWith('fooba', 0, DEFAULT_LIMIT, true);
    expect(fetchCards).toHaveBeenCalledWith('foobar', 0, DEFAULT_LIMIT, true);

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });
  it('should clear search on component unmount', () => {
    const {Component: Search} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();

    const component = renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
        />
      </TestContextProvider>
    );

    const searchInput = component.root.find(el => el.props.testID === 'search-input');
    searchInput.props.onChange('foo');

    component.unmount();
    expect(editSearch).toHaveBeenCalledTimes(2);
    expect(clearSearch).toHaveBeenCalledTimes(1);
  });
});
