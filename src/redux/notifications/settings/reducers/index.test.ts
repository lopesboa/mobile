import {NotificationSettingStatus} from '../../../../types';
import {ACTION_NAME} from '../actions';
import type {Action} from '../actions';
import {NOTIFICATION_SETTINGS_TYPE, NOTIFICATION_SETTINGS_STATUS} from '../../../../const';
import reducer from '.';
import type {State} from '.';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

function createState({
  authorizeAllStatus,
  finishCourseStatus,
  suggestionStatus,
}: {
  authorizeAllStatus: NotificationSettingStatus;
  finishCourseStatus: NotificationSettingStatus;
  suggestionStatus: NotificationSettingStatus;
}): State {
  return {
    authorizeAll: {
      label: 'Authorize notifications',
      status: authorizeAllStatus,
    },
    'finish-course': {
      label: 'Currently doing reminder',
      status: finishCourseStatus,
    },
    suggestion: {
      label: 'Course recommendations',
      status: suggestionStatus,
    },
  };
}

function reducerMacro(assert: jest.Expect, input: State, expected: State) {
  return assert(input).toEqual(expected);
}

describe('Notifications Settings - Reducers', () => {
  describe('Android', () => {
    it('defaults to all notifications settings to true if platform is Android', () => {
      const action = {
        type: 'FAKE_ACTION',
      };
      // @ts-ignore we are trying to emulate something else
      const result = reducer(undefined, action);
      reducerMacro(
        expect,
        result,
        createState({
          authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        }),
      );
    });
  });

  it('toggles off the finish-course notification settings if authorize notifications settings is on', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      }),
    );
  });

  it('toggles off the suggestion notification settings if authorize notifications settings is on', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.SUGGESTION,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };

    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      }),
    );
  });

  it('toggles on the authorize notifications settings and so the rest', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
        value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };

    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      }),
    );
  });
  it('toggles off the authorize notifications settings and so the rest', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };
    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      }),
    );
  });

  it('toggles on the authorize notifications settings when any other settings are being set to true', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      },
    };
    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      }),
    );
  });

  it('toggles off the authorize notifications when we toggle off the only activated notification', () => {
    const action: Action = {
      type: ACTION_NAME,
      payload: {
        type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
        value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      },
    };
    const state = createState({
      authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
      suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
    });

    reducerMacro(
      expect,
      reducer(state, action),
      createState({
        authorizeAllStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        finishCourseStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        suggestionStatus: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
      }),
    );
  });
});
