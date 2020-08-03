import {CHANGE} from '../../actions/permissions/camera';
import type {Action} from '../../actions/permissions/camera';
import {PERMISSION_STATUS} from '../../../const';
import reducer from './camera';
import type {State} from './camera';

describe('Permissions', () => {
  const expectedInitialState: State = PERMISSION_STATUS.UNDETERMINED;

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
      const expected: State = PERMISSION_STATUS.DENIED;
      expect(result).toEqual(expected);
    });
  });
});
