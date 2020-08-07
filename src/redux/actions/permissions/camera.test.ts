import {Platform} from 'react-native';
import {ANALYTICS_EVENT_TYPE, PERMISSION_STATUS} from '../../../const';
import type {PermissionStatus} from '../../../types';
import translations from '../../../translations';
import {createFakeAnalytics} from '../../../utils/tests';
import type {Action} from './camera';
import {check, request, change, toOSCameraPermission, CHECK, REQUEST, CHANGE} from './camera';

const createStore = (status: PermissionStatus) => ({
  getState: jest.fn(() => ({permissions: {camera: status}})),
  dispatch: jest.fn(),
});

describe('Permissions', () => {
  describe('Platform permission', () => {
    it('should return android camera permission type', () => {
      Platform.OS = 'android';
      const result = toOSCameraPermission();
      expect(result).toEqual('android.permission.CAMERA');
    });
    it('should return ios camera permission type', () => {
      Platform.OS = 'ios';
      const result = toOSCameraPermission();
      expect(result).toEqual('ios.permission.CAMERA');
    });
    afterEach(() => {
      Platform.OS = 'ios';
    });
  });
  it('change', () => {
    const result = change(PERMISSION_STATUS.GRANTED);
    const expected: Action = {
      type: CHANGE,
      payload: {
        type: 'camera',
        status: PERMISSION_STATUS.GRANTED,
      },
    };
    expect(result).toEqual(expected);
  });

  describe('check', () => {
    const expected: Action = {
      type: CHECK,
      payload: {
        type: 'camera',
      },
    };

    it('with change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
      const services = {
        Permissions: {
          check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED)),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check('camera')(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'camera',
          status: PERMISSION_STATUS.UNDETERMINED,
        },
      };
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.check.mock.calls.length).toBe(1);
      expect(services.Permissions.check.mock.calls[0]).toEqual(['ios.permission.CAMERA']);
    });

    it('without change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.GRANTED);
      const services = {
        Permissions: {
          check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.GRANTED)),
        },
      };
      // @ts-ignore we dont want to mock the entire services object
      await check('camera')(dispatch, getState, {services});
      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(services.Permissions.check.mock.calls.length).toBe(1);
      expect(services.Permissions.check.mock.calls[0]).toEqual(['ios.permission.CAMERA']);
    });
  });

  describe('request', () => {
    const expected: Action = {
      type: REQUEST,
      payload: {
        type: 'camera',
      },
    };

    describe('should handle request', () => {
      it('with deny callback and change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
            check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.GRANTED)),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        const expectedChangeAction: Action = {
          type: CHANGE,
          payload: {
            type: 'camera',
            status: PERMISSION_STATUS.DENIED,
          },
        };
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
        expect(handleDeny.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls[0]).toEqual(['ios.permission.CAMERA']);

        expect(services.Analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PERMISSION, {
          type: 'camera',
          status: PERMISSION_STATUS.DENIED,
        });
      });

      it('without deny callback and no change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED)),
            check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.GRANTED)),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(handleDeny.mock.calls.length).toBe(0);
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls[0]).toEqual(['ios.permission.CAMERA']);

        expect(services.Analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.PERMISSION, {
          type: 'camera',
          status: PERMISSION_STATUS.UNDETERMINED,
        });
      });
    });

    describe('should handle alert after a deny', () => {
      it('should try another request after denial', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            alert: jest.fn(),
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
            check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
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
            {onPress: expect.any(Function), text: translations.ok},
          ],
          {cancelable: false},
        ]);
        // @ts-ignore
        const onPressResult = await services.Permissions.alert.mock.calls[0][2][1].onPress();
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(onPressResult).toEqual(PERMISSION_STATUS.DENIED);
      });

      it('should open settings', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            alert: jest.fn((title, description, [quitOption, validateOption]) => {
              // @ts-ignore this simulates a press on the button
              quitOption && quitOption.onPress();
            }),
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
            check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.alert.mock.calls.length).toBe(2);
        expect(services.Permissions.alert.mock.calls[1]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: expect.any(Function), style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.openSettings},
          ],
          {cancelable: false},
        ]);
        // @ts-ignore
        const onPressResult = await services.Permissions.alert.mock.calls[1][2][1].onPress();
        expect(services.Permissions.request.mock.calls.length).toBe(0);
        expect(onPressResult).toEqual(undefined);
      });

      it('should not open settings', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Analytics: createFakeAnalytics(),
          Permissions: {
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            alert: jest.fn((title, description, [quitOption, validateOption]) => {
              // @ts-ignore this simulates a press on the button
              quitOption && quitOption.onPress();
            }),
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
            check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED)),
          },
        };
        // @ts-ignore we dont want to mock the entire services object
        await request('foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.alert.mock.calls.length).toBe(2);
        expect(services.Permissions.alert.mock.calls[1]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: expect.any(Function), style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.openSettings},
          ],
          {cancelable: false},
        ]);
        // @ts-ignore
        const onPressResult = await services.Permissions.alert.mock.calls[1][2][0].onPress();
        expect(services.Permissions.request.mock.calls.length).toBe(0);
        expect(onPressResult).toEqual(undefined);
      });
    });
  });
});
