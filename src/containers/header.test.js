// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import translations from '../translations';
import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import {DEFAULT_LIMIT} from '../redux/actions/catalog/cards/fetch/search';

jest.useFakeTimers();

describe('Header', () => {
  describe('mapStateToProps', () => {
    it('should return the accurate props', () => {
      const {mapStateToProps} = require('./header');

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
        isSearchFetching: false,
        isSearchVisible: false
      };
      expect(props).toEqual(expectedResult);
    });
  });

  describe('onSearchToggle', () => {
    it('should handle event', () => {
      const {Component: Header} = require('./header');

      const fakeCallback = jest.fn();
      const clearSearch = jest.fn();
      const toggleSearch = jest.fn();
      const value = true;

      const component = renderer.create(
        <Header
          isSearchVisible={false}
          isSearchFetching={false}
          signOut={fakeCallback}
          toggleSearch={toggleSearch}
          editSearch={fakeCallback}
          fetchCards={fakeCallback}
          clearSearch={clearSearch}
          height={42}
        />
      );

      const header = component.root.find(el => el.props.testID === 'header');
      header.props.onSearchToggle(value);

      expect(toggleSearch).toHaveBeenCalledTimes(1);
      expect(toggleSearch).toHaveBeenCalledWith(value);
      expect(clearSearch).toHaveBeenCalledTimes(0);
    });

    it('should handle event and clear results', () => {
      const {Component: Header} = require('./header');

      const fakeCallback = jest.fn();
      const clearSearch = jest.fn();
      const toggleSearch = jest.fn();
      const value = false;

      const component = renderer.create(
        <Header
          isSearchVisible={false}
          isSearchFetching={false}
          signOut={fakeCallback}
          toggleSearch={toggleSearch}
          editSearch={fakeCallback}
          fetchCards={fakeCallback}
          clearSearch={clearSearch}
          height={42}
        />
      );

      const header = component.root.find(el => el.props.testID === 'header');
      header.props.onSearchToggle(value);

      expect(toggleSearch).toHaveBeenCalledTimes(1);
      expect(toggleSearch).toHaveBeenCalledWith(value);
      expect(clearSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle onSearchInputChange', () => {
    const {Component: Header, SEARCH_DEBOUNCE_DURATION} = require('./header');

    const fakeCallback = jest.fn();
    const editSearch = jest.fn();
    const fetchCards = jest.fn();
    const clearSearch = jest.fn();

    const component = renderer.create(
      <Header
        isSearchVisible={false}
        isSearchFetching={false}
        signOut={fakeCallback}
        toggleSearch={fakeCallback}
        editSearch={editSearch}
        fetchCards={fetchCards}
        clearSearch={clearSearch}
        height={42}
      />
    );

    const header = component.root.find(el => el.props.testID === 'header');
    header.props.onSearchInputChange('f');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    header.props.onSearchInputChange('fo');
    header.props.onSearchInputChange('foo');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    header.props.onSearchInputChange('foob');
    header.props.onSearchInputChange('fooba');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    header.props.onSearchInputChange('foobar');
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_DURATION);
    header.props.onSearchInputChange('');

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

  it('should handle onLogoLongPress', () => {
    const {Alert} = require('react-native');
    const alert = jest.spyOn(Alert, 'alert');

    const {Component: Header} = require('./header');

    const fakeCallback = jest.fn();
    const signOut = jest.fn();

    const component = renderer.create(
      <Header
        isSearchVisible={false}
        isSearchFetching={false}
        signOut={signOut}
        toggleSearch={fakeCallback}
        editSearch={fakeCallback}
        fetchCards={fakeCallback}
        clearSearch={fakeCallback}
        height={42}
      />
    );

    alert.mockImplementationOnce((title, message, buttons) => {
      expect(title).toEqual(translations.logOut);
      expect(message).toBeNil;
      expect(buttons).toEqual([
        {
          text: translations.cancel
        },
        {
          text: translations.ok,
          onPress: expect.any(Function)
        }
      ]);

      const {onPress} = buttons[1];

      onPress();

      expect(signOut).toHaveBeenCalledTimes(1);
    });

    const header = component.root.find(el => el.props.testID === 'header');
    header.props.onLogoLongPress();

    expect(alert).toHaveBeenCalledTimes(1);
  });
});
