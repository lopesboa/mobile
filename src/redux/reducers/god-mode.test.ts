import {TOGGLE} from '../actions/god-mode';
import type {Action} from '../actions/god-mode';
import reducer from './god-mode';
import type {State} from './god-mode';

describe('GodMode', () => {
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
