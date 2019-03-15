// @flow strict

import {PERMISSION_STATUS} from '../../const';
import type {PermissionStatus} from '../../types';
import translations from '../../translations';
import type {Action} from './permissions';
import {check, request, change, CHECK, REQUEST, CHANGE} from './permissions';

const createStore = (status: PermissionStatus) => ({
  getState: jest.fn(() => ({permissions: {camera: status}})),
  dispatch: jest.fn()
});

describe('Permissions', () => {
  it('change', () => {
    const result = change('camera', PERMISSION_STATUS.AUTHORIZED);
    const expected: Action = {
      type: CHANGE,
      payload: {
        type: 'camera',
        status: PERMISSION_STATUS.AUTHORIZED
      }
    };
    expect(result).toEqual(expected);
  });

  describe('check', () => {
    const expected: Action = {
      type: CHECK,
      payload: {
        type: 'camera'
      }
    };

    it('with change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
      const services = {
        Permissions: {
          check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED))
        }
      };
      // $FlowFixMe we dont want to mock the entire services object
      await check('camera')(dispatch, getState, {services});
      const expectedChangeAction: Action = {
        type: CHANGE,
        payload: {
          type: 'camera',
          status: PERMISSION_STATUS.UNDETERMINED
        }
      };
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
      expect(services.Permissions.check.mock.calls.length).toBe(1);
      expect(services.Permissions.check.mock.calls[0]).toEqual(['camera']);
    });

    it('without change', async () => {
      const {getState, dispatch} = createStore(PERMISSION_STATUS.AUTHORIZED);
      const services = {
        Permissions: {
          check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.AUTHORIZED))
        }
      };
      // $FlowFixMe we dont want to mock the entire services object
      await check('camera')(dispatch, getState, {services});
      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0]).toEqual([expected]);
      expect(services.Permissions.check.mock.calls.length).toBe(1);
      expect(services.Permissions.check.mock.calls[0]).toEqual(['camera']);
    });
  });

  describe('request', () => {
    const expected: Action = {
      type: REQUEST,
      payload: {
        type: 'camera'
      }
    };

    describe('should handle request', () => {
      it('with deny callback and change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Permissions: {
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED))
          }
        };
        // $FlowFixMe we dont want to mock the entire services object
        await request('camera', 'foo bar baz', handleDeny)(dispatch, getState, {services});
        const expectedChangeAction: Action = {
          type: CHANGE,
          payload: {
            type: 'camera',
            status: PERMISSION_STATUS.DENIED
          }
        };
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(dispatch.mock.calls[1]).toEqual([expectedChangeAction]);
        expect(handleDeny.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls[0]).toEqual(['camera']);
      });

      it('without deny callback and no change', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.UNDETERMINED);
        const handleDeny = jest.fn();
        const services = {
          Permissions: {
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED))
          }
        };
        // $FlowFixMe we dont want to mock the entire services object
        await request('camera', 'foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(handleDeny.mock.calls.length).toBe(0);
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(services.Permissions.request.mock.calls[0]).toEqual(['camera']);
      });
    });

    describe('should handle alert after a deny', () => {
      it('can open settings', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Permissions: {
            canOpenSettings: jest.fn(() => Promise.resolve(true)),
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            alert: jest.fn(),
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED))
          }
        };
        // $FlowFixMe we dont want to mock the entire services object
        await request('camera', 'foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.canOpenSettings.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls[0]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: handleDeny, style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.openSettings}
          ],
          {cancelable: false}
        ]);
        // $FlowFixMe
        const onPressResult = await services.Permissions.alert.mock.calls[0][2][1].onPress();
        expect(services.Permissions.request.mock.calls.length).toBe(0);
        expect(onPressResult).toEqual(undefined);
      });

      it('can not open settings', async () => {
        const {getState, dispatch} = createStore(PERMISSION_STATUS.DENIED);
        const handleDeny = jest.fn();
        const services = {
          Permissions: {
            canOpenSettings: jest.fn(() => Promise.resolve(false)),
            openSettings: jest.fn(() => Promise.resolve(undefined)),
            alert: jest.fn(),
            request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.DENIED))
          }
        };
        // $FlowFixMe we dont want to mock the entire services object
        await request('camera', 'foo bar baz', handleDeny)(dispatch, getState, {services});
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0]).toEqual([expected]);
        expect(services.Permissions.canOpenSettings.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls.length).toBe(1);
        expect(services.Permissions.alert.mock.calls[0]).toEqual([
          translations.permission,
          'foo bar baz',
          [
            {onPress: handleDeny, style: 'cancel', text: translations.quit},
            {onPress: expect.any(Function), text: translations.ok}
          ],
          {cancelable: false}
        ]);
        // $FlowFixMe
        const onPressResult = await services.Permissions.alert.mock.calls[0][2][1].onPress();
        expect(services.Permissions.request.mock.calls.length).toBe(1);
        expect(onPressResult).toEqual(PERMISSION_STATUS.DENIED);
      });
    });
  });
});
