import * as React from 'react';
import renderer from 'react-test-renderer';

describe('WithAudio', () => {
  it('should give props', () => {
    const withAudio = jest.requireActual('./with-audio').default;

    const fakeComponent = jest.fn(() => null);
    // @ts-ignore fake component
    const Component = withAudio(fakeComponent);
    renderer.create(<Component />);

    const expected = {
      audio: {
        AUDIO_FILE: {
          WRONG_ANSWER: expect.any(Object),
          GOOD_ANSWER: expect.any(Object),
          FAILURE_LEVEL: expect.any(Object),
          SUCCESS_LEVEL: expect.any(Object),
        },
        // @ts-ignore no callable signature found
        play: expect.any(Function),
      },
    };

    expect(fakeComponent).toHaveBeenCalledTimes(1);
    expect(fakeComponent.mock.calls[0][0]).toEqual(expected);
  });
});
