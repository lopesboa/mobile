import * as React from 'react';
import renderer from 'react-test-renderer';
import {handleFakePress, TestContextProvider} from '../utils/tests';
import type {WithPermissionsProps} from './with-permissions';

describe('WithPermissions', () => {
  it('should give props', () => {
    const withPermissions = jest.requireActual('./with-permissions').default;

    const fakeComponent = jest.fn(() => null);
    // @ts-ignore fake component
    const Component = withPermissions(fakeComponent, ['notifications']);
    renderer.create(
      <TestContextProvider>
        <Component />
      </TestContextProvider>,
    );

    const expected: WithPermissionsProps = {
      changeNotificationsPermission: expect.any(Function),
      checkCameraPermission: expect.any(Function),
      checkNotificationsPermission: expect.any(Function),
      requestCameraPermission: expect.any(Function),
      requestNotificationsPermission: expect.any(Function),
    };

    expect(fakeComponent).toHaveBeenCalledTimes(1);
    expect(fakeComponent.mock.calls[0][0]).toEqual(expected);
  });
});
