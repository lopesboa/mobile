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
          ref: levelRef,
        },
      });

      const mockedStore = createStoreState({
        levels: [],
        disciplines: [],
        chapters: [],
        slides: [],
        progression,
      });

      const props = mapStateToProps(mockedStore);
      const expectedResult = {
        isSearchFetching: false,
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
      </TestContextProvider>,
    );

    const searchInput = component.root.find((el) => el.props.testID === 'search-input');
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
    expect(editSearch).toHaveBeenCalledWith({text: 'f'});
    expect(editSearch).toHaveBeenCalledWith({text: 'fo'});
    expect(editSearch).toHaveBeenCalledWith({text: 'foo'});
    expect(editSearch).toHaveBeenCalledWith({text: 'foob'});
    expect(editSearch).toHaveBeenCalledWith({text: 'fooba'});
    expect(editSearch).toHaveBeenCalledWith({text: 'foobar'});
    expect(editSearch).toHaveBeenCalledWith({text: ''});

    expect(fetchCards).toHaveBeenCalledTimes(3);
    expect(fetchCards).toHaveBeenCalledWith('foo', 0, DEFAULT_LIMIT, {}, true);
    expect(fetchCards).toHaveBeenCalledWith('fooba', 0, DEFAULT_LIMIT, {}, true);
    expect(fetchCards).toHaveBeenCalledWith('foobar', 0, DEFAULT_LIMIT, {}, true);

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });

  it('should fire a search on componentDidMount', () => {
    const {Component: Search} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();
    const searchParams = {
      skill: 'skill_rnDe3sfRz',
    };

    renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={searchParams}
        />
      </TestContextProvider>,
    );

    expect(fetchCards).toHaveBeenCalledTimes(1);
    expect(fetchCards).toHaveBeenCalledWith('', 0, DEFAULT_LIMIT, {skill: 'skill_rnDe3sfRz'}, true);
  });

  it('should fire a search on componentDidUpdate if previous search params was empty', () => {
    const {Component: Search} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();
    const searchParams = {
      skill: 'skill_rnDe3sfRz',
    };

    const component = renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
        />
      </TestContextProvider>,
    );

    component.update(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={searchParams}
        />
      </TestContextProvider>,
    );

    expect(clearSearch).toHaveBeenCalledTimes(1);
    expect(editSearch).toHaveBeenCalledTimes(1);
    expect(editSearch).toHaveBeenCalledWith({text: ''});
    expect(fetchCards).toHaveBeenCalledTimes(1);
    expect(fetchCards).toHaveBeenCalledWith('', 0, DEFAULT_LIMIT, {skill: 'skill_rnDe3sfRz'}, true);
  });

  it('should fire a search on componentDidUpdate if previous search params and next search params are different', () => {
    const {Component: Search} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();
    const searchParams = {
      skill: 'skill_rnDe3sfRz',
    };

    const component = renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={{skill: 'skill_pnFe2seFz'}}
        />
      </TestContextProvider>,
    );

    component.update(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={searchParams}
        />
      </TestContextProvider>,
    );

    expect(clearSearch).toHaveBeenCalledTimes(1);
    expect(editSearch).toHaveBeenCalledTimes(1);
    expect(editSearch).toHaveBeenCalledWith({text: ''});
    expect(fetchCards).toHaveBeenCalledTimes(2);
    expect(fetchCards).toHaveBeenCalledWith('', 0, DEFAULT_LIMIT, {skill: 'skill_rnDe3sfRz'}, true);
  });

  it('should only fire a search once on componentDidMount and not fire it on componentDidUpdate if previous search params and next search params are equal', () => {
    const {Component: Search} = require('./search');

    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();
    const searchParams = {
      skill: 'skill_rnDe3sfRz',
    };

    const component = renderer.create(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={searchParams}
        />
      </TestContextProvider>,
    );

    component.update(
      <TestContextProvider>
        <Search
          isSearchFetching={false}
          editSearch={editSearch}
          fetchCards={fetchCards}
          clearSearch={clearSearch}
          searchParams={searchParams}
        />
      </TestContextProvider>,
    );

    expect(clearSearch).toHaveBeenCalledTimes(0);
    expect(editSearch).toHaveBeenCalledTimes(0);
    expect(fetchCards).toHaveBeenCalledTimes(1);
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
      </TestContextProvider>,
    );

    const searchInput = component.root.find((el) => el.props.testID === 'search-input');
    searchInput.props.onChange('foo');

    component.unmount();
    expect(editSearch).toHaveBeenCalledTimes(2);
    expect(clearSearch).toHaveBeenCalledTimes(1);
  });
});
