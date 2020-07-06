import {INCREMENT} from '../actions/app-session';
import type {Action} from '../actions/app-session';
import reducer from './app-session';
import type {State} from './app-session';

describe('App Session', () => {
  const expectedInitialState: State = 0;
  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(INCREMENT, () => {
    it('Default', () => {
      const action: Action = {
        type: INCREMENT,
      };
      const result = reducer(undefined, action);
      const expected: State = 1;
      expect(result).toEqual(expected);
    });
  });
});
