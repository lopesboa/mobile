// import {Platform} from 'react-native';
import {TOGGLE} from '../../actions/notifications/settings';
import type {Action} from '../../actions/notifications/settings';
import {NOTIFICATION_SETTINGS_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../../../const';
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
        authorizeAll: {
          label: 'Authorize notifications',
          status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
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

  it('toggles off the finish-course notification settings if authorize notifications settings is on', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
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

  it('toggles off the suggestion notification settings if authorize notifications settings is on', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.SUGGESTION,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
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

  it('toggles on the authorize notifications settings and so the rest', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
        value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
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
  it('toggles off the authorize notifications settings and so the rest', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };
    expect(result).toEqual(expected);
  });

  it('toggles on the authorize notifications settings when any other settings are being set to true', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
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

  it('toggles off the authorize notifications when we toggle off the only activated notification', () => {
    const action: Action = {
      type: TOGGLE,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const result = reducer(state, action);
    const expected: State = {
      authorizeAll: {
        label: 'Authorize notifications',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      'finish-course': {
        label: 'Currently doing reminder',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
      suggestion: {
        label: 'Course recommendations',
        status: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };
    expect(result).toEqual(expected);
  });
});
