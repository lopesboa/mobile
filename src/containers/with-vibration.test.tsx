import * as React from 'react';
import renderer from 'react-test-renderer';

import {createFakeVibration} from '../utils/tests';
import type {WithVibrationProps} from './with-vibration';

describe('WithVibration', () => {
  it('should give props', () => {
    const withVibration = jest.requireActual('./with-vibration').default;

    const fakeComponent = jest.fn(() => null);
    // @ts-ignore fake component
    const Component = withVibration(fakeComponent);
    renderer.create(<Component />);

    const vibration = createFakeVibration();
    const expected: WithVibrationProps = {
      vibration: {
        ...vibration,
        // @ts-ignore no callable signature found
        vibrate: expect.any(Function),
      },
    };

    expect(fakeComponent).toHaveBeenCalledTimes(1);
    expect(fakeComponent.mock.calls[0][0]).toEqual(expected);
  });
});
