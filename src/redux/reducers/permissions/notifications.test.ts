import {CHANGE} from '../../actions/permissions/notifications';
import type {Action} from '../../actions/permissions/notifications';
import {PERMISSION_STATUS} from '../../../const';
import reducer from './notifications';
import type {State} from './notifications';

describe('Permissions', () => {
  const expectedInitialState: State = PERMISSION_STATUS.UNDETERMINED;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
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
          type: 'notifications',
          status: PERMISSION_STATUS.DENIED
        }
      };
      const result = reducer(undefined, action);
      const expected: State = PERMISSION_STATUS.DENIED;
      expect(result).toEqual(expected);
    });
  });
});
