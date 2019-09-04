// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {createFakeAudio} from '../utils/tests';
import withAudio from './with-audio';
import type {WithAudioProps} from './with-audio';

describe('WithAudio', () => {
  it('should give props', () => {
    const fakeComponent = jest.fn(() => null);
    // $FlowFixMe fake component
    const Component = withAudio(fakeComponent);
    renderer.create(<Component />);

    const audio = createFakeAudio();
    const props: WithAudioProps = {
      audio: {
        ...audio,
        // $FlowFixMe no callable signature found
        play: expect.any(Function)
      }
    };

    expect(fakeComponent).toHaveBeenCalledTimes(1);
    expect(fakeComponent.mock.calls[0][0]).toEqual(props);
  });
});
