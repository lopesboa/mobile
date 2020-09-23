import {NOTIFICATION_SETTINGS_STATUS, NOTIFICATION_SETTINGS_TYPE} from '../../../const';
import {TOGGLE, toggle} from './settings';
import type {Action} from './settings';

const createStore = (isActive: boolean) => ({
  getState: jest.fn(() => ({
    notifications: {
      settings: {
        authorizeAll: {
          label: 'Authorize notifications',
          status: isActive
            ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
            : NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
        'finish-course': {
          label: 'Finish Course',
          status: isActive
            ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
            : NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
        suggestion: {
          label: 'Suggestion Course',
          status: isActive
            ? NOTIFICATION_SETTINGS_STATUS.ACTIVATED
            : NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      },
    },
  })),
  dispatch: jest.fn(),
});

describe('Notifications Settings', () => {
  describe('Authorize notifications', () => {
    it('toggles to true', async () => {
      const {getState, dispatch} = createStore(false);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
          value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('toggles to false', async () => {
      const {getState, dispatch} = createStore(true);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL,
          value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.AUTHORIZE_ALL)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('Finish Course', () => {
    it('toggles to true', async () => {
      const {getState, dispatch} = createStore(false);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
          value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('toggles to false', async () => {
      const {getState, dispatch} = createStore(true);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE,
          value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.FINISH_COURSE)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('Suggestion', () => {
    it('toggles to true', async () => {
      const {getState, dispatch} = createStore(false);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.SUGGESTION,
          value: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.SUGGESTION)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });

    it('toggles to false', async () => {
      const {getState, dispatch} = createStore(true);
      const expected: Action = {
        type: TOGGLE,
        payload: {
          type: NOTIFICATION_SETTINGS_TYPE.SUGGESTION,
          value: NOTIFICATION_SETTINGS_STATUS.DEACTIVATED,
        },
      };
      // @ts-ignore missing callable signature
      await toggle(NOTIFICATION_SETTINGS_TYPE.SUGGESTION)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
