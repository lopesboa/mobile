// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {QUESTION_TYPE, ENGINE, CONTENT_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import {createProgression} from '../__fixtures__/progression';
import {createSelectState, createStoreState} from '../__fixtures__/store';
import {Component as Select, mapStateToProps} from './select';
import type {ConnectedStateProps} from './select';

describe('Select', () => {
  describe('mapStateToProps', () => {
    const id = 'foo';
    const select = createSelectState({id});

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
        select
      });

      const result = mapStateToProps(mockedStore, {id});
      const expected: ConnectedStateProps = {
        isFocused: true
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle focus', () => {
    const focus = jest.fn();
    const blur = jest.fn();
    const id = 'foo';

    const component = renderer.create(
      <Select
        questionType={QUESTION_TYPE.TEMPLATE}
        analyticsID="foo"
        values={[]}
        onChange={handleFakePress}
        focus={focus}
        blur={blur}
        id={id}
        isFocused={false}
        testID="select"
      />
    );

    const modal = component.root.find(el => el.props.testID === 'select' && el.props.onFocus);
    modal.props.onFocus();

    expect(focus).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalledWith(id);
  });

  it('should handle blur', () => {
    const focus = jest.fn();
    const blur = jest.fn();
    const id = 'foo';

    const component = renderer.create(
      <Select
        questionType={QUESTION_TYPE.TEMPLATE}
        analyticsID="foo"
        values={[]}
        onChange={handleFakePress}
        focus={focus}
        blur={blur}
        id={id}
        isFocused
        testID="select"
      />
    );

    const modal = component.root.find(el => el.props.testID === 'select' && el.props.onBlur);
    modal.props.onBlur();

    expect(blur).toHaveBeenCalledTimes(1);
  });
});
