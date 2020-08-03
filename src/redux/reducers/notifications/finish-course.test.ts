import {Platform} from 'react-native';
import {TOGGLE} from '../../actions/notifications/finish-course';
import type {Action} from '../../actions/notifications/finish-course';
import reducer from './finish-course';
import type {State} from './finish-course';
import {NOTIFICATION_TYPE} from '../../../const';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('FastSlide', () => {
  describe('Default', () => {
    beforeEach(async () => {
      await jest.resetModules();
    });

    afterEach(async () => {
      await jest.resetAllMocks();
    });

    it('defaults to true if platform is Android', () => {
      const action = {
        type: 'FAKE_ACTION',
      };
      // @ts-ignore we are trying to emulate something else
      const result = reducer(undefined, action);
      const expected: State = {
        type: NOTIFICATION_TYPE.FINISH_COURSE,
        label: 'Currently doing reminder',
        isActive: true,
      };
      expect(result).toEqual(expected);
    });
  });

  describe(TOGGLE, () => {
    it('Default', () => {
      const action: Action = {
        type: TOGGLE,
        payload: true,
      };
      const result = reducer(undefined, action);
      const expected: State = {
        type: NOTIFICATION_TYPE.FINISH_COURSE,
        label: 'Currently doing reminder',
        isActive: true,
      };
      expect(result).toEqual(expected);
    });
  });
});
