import * as React from 'react';
import renderer from 'react-test-renderer';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import orientation from 'react-native-orientation-locker';
import {handleFakePress} from '../utils/tests';

import {ENGINE, CONTENT_TYPE} from '../const';
import {createProgression} from '../__fixtures__/progression';
import {createVideoState, createStoreState} from '../__fixtures__/store';
import {STEP} from '../components/video-overlay';
import {STATE} from '../components/video-youtube';
import {mapStateToProps, Component as YoutubePlayer} from './video-youtube';
import type {ConnectedStateProps} from './video-youtube';

const createRef = (): VideoPlayer => ({
  seekTo: jest.fn(),
  player: {},
});

describe('VideoYoutube', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('mapStateToProps', () => {
    it('should get default props', () => {
      const id = 'foo';
      const isFullScreen = true;
      const apiKey = '7Hi5iS4f4k34P1K3Y';
      const levelRef = 'dummyRef';
      const onPlay = handleFakePress;
      const height = 200;
      const preview = {uri: 'https://foo.bar'};

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: levelRef,
        },
      });
      const video = createVideoState({isFullScreen});

      const mockedStore = createStoreState({
        progression,
        video,
      });

      const result = mapStateToProps(mockedStore, {
        id,
        onPlay,
        preview,
        height,
      });
      const expected: ConnectedStateProps = {
        isFullScreen,
        apiKey,
      };

      expect(result).toEqual(expected);
    });
  });

  it('should handle onError', () => {
    const id = 'FZnfetzzr';
    const onPlay = handleFakePress;
    const height = 200;
    const isFullScreen = false;
    const apiKey = '7Hi5iS4f4k34P1K3Y';
    const toggleFullscreen = jest.fn();
    const preview = {uri: 'https://foo.bar'};

    const component = renderer.create(
      <YoutubePlayer
        id={id}
        height={height}
        apiKey={apiKey}
        preview={preview}
        onPlay={onPlay}
        isFullScreen={isFullScreen}
        toggleFullscreen={toggleFullscreen}
      />,
    );

    const video = component.root.find((el) => el.props.onError);
    video.props.onError();

    expect(video.props.step).toEqual(STEP.ERROR);
  });

  describe('onChangeFullscreen', () => {
    it('should handle change Fullscreen', async () => {
      const toggleFullscreen = jest.fn();
      const id = 'FZnfetzzr';
      const onPlay = handleFakePress;
      const height = 200;
      const isFullScreen = false;
      const apiKey = '7Hi5iS4f4k34P1K3Y';
      const preview = {uri: 'https://foo.bar'};
      const component = renderer.create(
        <YoutubePlayer
          id={id}
          apiKey={apiKey}
          height={height}
          preview={preview}
          onPlay={onPlay}
          isFullScreen={isFullScreen}
          toggleFullscreen={toggleFullscreen}
        />,
      );

      const video = component.root.find((el) => el.props.onChangeFullscreen);
      await video.props.onChangeFullscreen();

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
      expect(toggleFullscreen).toHaveBeenCalledWith(true);
      expect(orientation.unlockAllOrientations).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle onEnd', async () => {
    const toggleFullscreen = jest.fn();
    const ref = createRef();
    const currentState = {state: STATE.ENDED, target: 2030};
    const id = 'FZnfetzzr';
    const onPlay = handleFakePress;
    const height = 200;
    const isFullScreen = false;
    const preview = {uri: 'https://foo.bar'};
    const component = renderer.create(
      <YoutubePlayer
        id={id}
        height={height}
        preview={preview}
        onPlay={onPlay}
        isFullScreen={isFullScreen}
        toggleFullscreen={toggleFullscreen}
      />,
    );

    const video = component.root.find((el) => el.props.onChangeState);
    video.props.onRef(ref);
    await video.props.onChangeState(currentState);

    expect(video.props.step).toEqual(STEP.END);
    expect(ref.seekTo).toHaveBeenCalledTimes(0);
    expect(orientation.lockToPortrait).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
