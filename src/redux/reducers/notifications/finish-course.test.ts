import {TOGGLE} from '../../actions/notifications/finish-course';
import type {Action} from '../../actions/notifications/finish-course';
import reducer from './finish-course';
import type {State} from './finish-course';

describe('FastSlide', () => {
  const expectedInitialState: State = {
    type: 'finish-course',
    label: 'Currently doing reminder',
    isActive: false,
  };

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
      const expected: State = {
        type: 'finish-course',
        label: 'Currently doing reminder',
        isActive: true,
      };
      expect(result).toEqual(expected);
    });
  });
});
