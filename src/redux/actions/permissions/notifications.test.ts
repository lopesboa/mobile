import {ANALYTICS_EVENT_TYPE, PERMISSION_STATUS} from '../../../const';
import type {PermissionStatus} from '../../../types';
import {createFakeAnalytics} from '../../../utils/tests';
import translations from '../../../translations';
import type {Action} from './notifications';
import {check, request, change, toggle, CHECK, REQUEST, CHANGE} from './notifications';

const createStore = (status: PermissionStatus) => ({
  getState: jest.fn(() => ({permissions: {notifications: status}})),
  dispatch: jest.fn(),
});

describe('Permissions', () => {
  it('change', () => {
    const result = change(PERMISSION_STATUS.GRANTED);
    const expected: Action = {
      type: CHANGE,
      payload: {
        type: 'notifications',
        status: PERMISSION_STATUS.GRANTED,
      },
    };
    expect(result).toEqual(expected);
  });

  describe('check', () => {
    const expected: Action = {
      type: CHECK,
      payload: {
        type: 'notifications',
      },
    };

    it('with change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() =>
            Promise.resolve({status: PERMISSION_STATUS.UNDETERMINED}),
          ),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check()(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'notifications',
          status: PERMISSION_STATUS.UNDETERMINED,
        },
      };
      expect(dispatch.mock.calls.length).toBe(4);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });

    it('with change(granted)', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.GRANTED})),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check()(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'notifications',
          status: PERMISSION_STATUS.GRANTED,
        },
      };
      expect(dispatch.mock.calls.length).toBe(4);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });

    it('with change(denied)', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.DENIED})),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check()(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'notifications',
          status: PERMISSION_STATUS.DENIED,
        },
      };
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });

    it('without change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.GRANTED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.GRANTED})),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check()(dispatch, getState, {services});
      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });
  });

  describe('toggle', () => {
    const expected: Action = {
      type: CHECK,
      payload: {
        type: 'notifications',
      },
    };

    it('toggle to denied', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.GRANTED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.GRANTED})),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await toggle()(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'notifications',
          status: PERMISSION_STATUS.DENIED,
        },
      };
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });

    it('toggle to granted', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.GRANTED);
      const services = {
        Permissions: {
          checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.DENIED})),
        },
      };
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'notifications',
          status: PERMISSION_STATUS.GRANTED,
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await toggle()(dispatch, getState, {services});
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.checkNotifications.mock.calls.length).toBe(1);
    });
  });

  describe('request', () => {
    const expected: Action = {
      type: REQUEST,
      payload: {
        type: 'notifications',
      },
    };

    describe('should handle request', () => {
      it('with deny callback and change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.DENIED})),
            requestNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.DENIED}),
            ),
          },
        };

        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        const expectedChangeAction: Action = {
          type: CHANGE,
          payload: {
            type: 'notifications',
            status: PERMISSION_STATUS.DENIED,
          },
        };
        expect(dispatch.mock.calls.length).toBe(4);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
        expect(handleDeny.mock.calls.length).toBe(1);
        expect(services.Permissions.requestNotifications.mock.calls.length).toBe(1);
        expect(services.Permissions.requestNotifications.mock.calls[0]).toEqual([
          ['alert', 'badge', 'sound'],
        ]);

        expect(services.Analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PERMISSION, {
          type: 'notifications',
          status: PERMISSION_STATUS.DENIED,
        });
      });

      it('without deny callback and no change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            checkNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.UNDETERMINED}),
            ),
            requestNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.UNDETERMINED}),
            ),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(handleDeny.mock.calls.length).toBe(0);
        expect(services.Permissions.requestNotifications.mock.calls.length).toBe(1);
        expect(services.Permissions.requestNotifications.mock.calls[0]).toEqual([
          ['alert', 'badge', 'sound'],
        ]);

        expect(services.Analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PERMISSION, {
          type: 'notifications',
          status: PERMISSION_STATUS.UNDETERMINED,
        });
      });



      it('when permission is granted', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            checkNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.UNDETERMINED}),
            ),
            requestNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.GRANTED}),
            ),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(4);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(handleDeny.mock.calls.length).toBe(0);
        expect(services.Permissions.requestNotifications.mock.calls.length).toBe(1);
        expect(services.Permissions.requestNotifications.mock.calls[0]).toEqual([
          ['alert', 'badge', 'sound'],
        ]);

        expect(services.Analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PERMISSION, {
          type: 'notifications',
          status: PERMISSION_STATUS.GRANTED,
        });
      });

      it('should open settings if notification permission is denied', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.DENIED})),
            alert: jest.fn(),
            requestNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.DENIED}),
            ),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.alert.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls[0]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: expect.any(Function), style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.openSettings},
          ],
          {cancelable: false},
        ]);
        // @ts-ignore
        const onPressResult = await services.Permissions.alert.mock.calls[0][2][1].onPress();
        expect(services.Permissions.requestNotifications.mock.calls.length).toBe(1);
        expect(onPressResult).toEqual(undefined);
      });

      it('should open settings if notification permission is blocked', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.BLOCKED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            checkNotifications: jest.fn(() => Promise.resolve({status: PERMISSION_STATUS.BLOCKED})),
            alert: jest.fn(),
            requestNotifications: jest.fn(() =>
              Promise.resolve({status: PERMISSION_STATUS.BLOCKED}),
            ),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.alert.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls[0]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: expect.any(Function), style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.openSettings},
          ],
          {cancelable: false},
        ]);
        // @ts-ignore
        const onPressResult = await services.Permissions.alert.mock.calls[0][2][1].onPress();
        expect(services.Permissions.requestNotifications.mock.calls.length).toBe(1);
        expect(onPressResult).toEqual(undefined);
      });
    });
  });
});
