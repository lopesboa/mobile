// @flow strict

import {createBrand} from '../../../__fixtures__/brands';
import {FETCH_SUCCESS, fetchSuccess} from '../../actions/brands';
import type {Action} from '../../actions/brands';
import reducer from './brand';
import type {State} from './brand';

describe('Cards', () => {
  const expectedInitialState: State = null;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const brand = createBrand();
      const action: Action = fetchSuccess(brand);
      const result = reducer(undefined, action);
      const expected: State = brand;
      expect(result).toEqual(expected);
    });
  });
});
