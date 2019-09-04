// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createFakeVibration} from '../utils/tests';
import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';

describe('WithVibration', () => {
  it('should give props', () => {
    const fakeComponent = jest.fn(() => null);
    // $FlowFixMe fake component
    const Component = withVibration(fakeComponent);
    renderer.create(<Component />);

    const vibration = createFakeVibration();
    const props: WithVibrationProps = {
      vibration: {
        ...vibration,
        // $FlowFixMe no callable signature found
        vibrate: expect.any(Function)
      }
    };

    expect(fakeComponent).toHaveBeenCalledTimes(1);
    expect(fakeComponent.mock.calls[0][0]).toEqual(props);
  });
});
