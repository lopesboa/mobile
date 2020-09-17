// import {Platform} from 'react-native';
import {TOGGLE} from '../../actions/notifications/settings';
import type {Action} from '../../actions/notifications/settings';
import {NOTIFICATION_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../../../const';
import reducer from './settings';
import type {State} from './settings';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('Notifications Settings', () => {
  describe('Android', () => {
    it('defaults to all notifications settings to true if platform is Android', () => {
      const action = {
        type: 'FAKE_ACTION',
      };
      // @ts-ignore we are trying to emulate something else
      const result = reducer(undefined, action);
      const expected: State = {
        'finish-course': {
          label: 'Currently doing reminder',
          status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
        suggestion: {
          label: 'Course recommendations',
          status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
      };
      expect(result).toEqual(expected);
    });
  });

  it('toggles the finish-course notification setting to false', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const result = reducer(undefined, action);
    const expected: State = {
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };
    expect(result).toEqual(expected);
  });

  it('toggles the suggestion notification setting to false', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_TYPE.SUGGESTION,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const result = reducer(undefined, action);
    const expected: State = {
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };
    expect(result).toEqual(expected);
  });
});
