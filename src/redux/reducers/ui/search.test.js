// @flow strict

import {EDIT, FETCH} from '../../actions/ui/search';
import type {Action} from '../../actions/ui/search';
import reducer from './search';
import type {State} from './search';

describe('Select', () => {
  const expectedInitialState: State = {
    isFetching: false
  };

  it('Default', () => {
    const action = {
      type: 'foo'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(EDIT, () => {
    it('Default', () => {
      const payload = 'foo';
      const action: Action = {
        type: EDIT,
        payload
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        value: payload
      };

      expect(result).toEqual(expected);
    });
  });

  describe(FETCH, () => {
    it('Default', () => {
      const payload = true;
      const action: Action = {
        type: FETCH,
        payload
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        isFetching: payload
      };

      expect(result).toEqual(expected);
    });
  });
});
