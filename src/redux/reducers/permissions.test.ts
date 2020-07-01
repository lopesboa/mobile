import {CHANGE} from '../actions/permissions';
import type {Action} from '../actions/permissions';
import {PERMISSION_STATUS} from '../../const';
import reducer from './permissions';
import type {State} from './permissions';

describe('Permissions', () => {
  const expectedInitialState: State = {
    camera: undefined,
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(CHANGE, () => {
    it('Default', () => {
      const action: Action = {
        type: CHANGE,
        payload: {
          type: 'camera',
          status: PERMISSION_STATUS.DENIED,
        },
      };
      const result = reducer(undefined, action);
      const expected: State = {
        ...expectedInitialState,
        camera: PERMISSION_STATUS.DENIED,
      };
      expect(result).toEqual(expected);
    });
  });
});
