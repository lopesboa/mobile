import {TOGGLE} from '../actions/fast-slide';
import type {Action} from '../actions/fast-slide';
import reducer from './fast-slide';
import type {State} from './fast-slide';

describe('FastSlide', () => {
  const expectedInitialState: State = false;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(TOGGLE, () => {
    it('Default', () => {
      const action: Action = {
        type: TOGGLE,
        payload: true,
      };
      const result = reducer(undefined, action);
      const expected: State = true;
      expect(result).toEqual(expected);
    });
  });
});
