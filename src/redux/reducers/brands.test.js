// @flow strict

import {createBrand} from '../../__fixtures__/brands';
import {FETCH_SUCCESS} from '../actions/brands';
import type {Action} from '../actions/brands';
import reducer from './brands';
import type {State} from './brands';

describe('Cards', () => {
  const expectedInitialState: State = {
    entities: {}
  };

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
      const token = '__TOKEN__';
      const brand = createBrand();
      const action: Action = {
        type: FETCH_SUCCESS,
        payload: {
          token: token,
          item: brand
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
        entities: {[token]: brand}
      };
      expect(result).toEqual(expected);
    });
  });
});
