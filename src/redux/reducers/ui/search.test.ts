import {EDIT, FETCH} from '../../actions/ui/search';
import type {Action} from '../../actions/ui/search';
import reducer from './search';
import type {State} from './search';

describe('Select', () => {
  const expectedInitialState: State = {
    isFetching: false,
  };

  it('Default', () => {
    const action = {
      type: 'foo',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(EDIT, () => {
    it('search value', () => {
      const value = 'foo';
      const action: Action = {
        type: EDIT,
        payload: {
          text: value,
        },
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        value: value,
      };

      expect(result).toEqual(expected);
    });

    it('search params', () => {
      const params = {theme: 'bar'};
      const action: Action = {
        type: EDIT,
        payload: {
          params,
        },
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        params: params,
      };

      expect(result).toEqual(expected);
    });
  });

  describe(FETCH, () => {
    it('Default', () => {
      const payload = true;
      const action: Action = {
        type: FETCH,
        payload,
      };
      const result = reducer(expectedInitialState, action);
      const expected: State = {
        ...expectedInitialState,
        isFetching: payload,
      };

      expect(result).toEqual(expected);
    });
  });
});
