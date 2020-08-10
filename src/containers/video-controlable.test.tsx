import * as React from 'react';
import {Platform} from 'react-native';
import renderer from 'react-test-renderer';
import {VIDEO_TRACK_TYPE} from '@coorpacademy/player-store';
import {TextTrackType} from 'react-native-video';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import orientation from 'react-native-orientation-locker';

import {ENGINE, CONTENT_TYPE} from '../const';
import {createProgression} from '../__fixtures__/progression';
import {createVideoState, createStoreState} from '../__fixtures__/store';
import {createVideoUri, createVideoTracks} from '../__fixtures__/videos';
import {VIDEO_PROVIDER} from '../layer/data/_const';
import {STEP} from '../components/video';
import {mapStateToProps, Component as VideoControlable} from './video-controlable';
import type {ConnectedStateProps} from './video-controlable';

const createRef = (): VideoPlayer => ({
  seekTo: jest.fn(),
  methods: {
    pause: jest.fn(),
  },
  player: {
    ref: {
      dismissFullscreenPlayer: jest.fn(),
      presentFullscreenPlayer: jest.fn(),
    },
  },
});

const expectedTracks = [
  {
    language: 'fr',
    title: 'fr',
    type: TextTrackType.VTT,
    uri: 'https://content.jwplatform.com/tracks/foo.srt',
  },
  {
    language: 'en',
    title: 'en',
    type: TextTrackType.VTT,
    uri: 'https://content.jwplatform.com/tracks/bar.srt',
  },
  {
    language: 'de',
    title: 'de',
    type: TextTrackType.VTT,
    uri: 'https://content.jwplatform.com/tracks/baz.srt',
  },
];

// Due to mocked functions messing up with global state mocks
describe('VideoControlable -> mapStateToProps', () => {
  it('should get default props', () => {
    const id = 'foo';
    const isFullScreen = true;
    const levelRef = 'dummyRef';
    const source = {uri: 'https://foo.bar'};

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

    const result = mapStateToProps(mockedStore, {id, provider: VIDEO_PROVIDER.JWPLAYER, source});
    const expected: ConnectedStateProps = {
      isFullScreen,
      source,
      tracks: [],
    };

    expect(result).toEqual(expected);
  });

  it('should get all props', () => {
    const id = 'foo';
    const isFullScreen = true;
    const uri = createVideoUri('foo', VIDEO_PROVIDER.JWPLAYER);
    const tracks = createVideoTracks('foo', VIDEO_TRACK_TYPE.VTT);
    const levelRef = 'dummyRef';

    const progression = createProgression({
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        type: CONTENT_TYPE.LEVEL,
        ref: levelRef,
      },
    });
    const video = createVideoState({isFullScreen});
    const videos = {
      [id]: {
        uri,
        tracks,
      },
    };

    const mockedStore = createStoreState({
      progression,
      video,
      videos,
    });

    const result = mapStateToProps(mockedStore, {id, provider: VIDEO_PROVIDER.JWPLAYER});
    const expected: ConnectedStateProps = {
      isFullScreen,
      source: {uri},
      tracks: expectedTracks,
      selectedTrack: expectedTracks[1].language,
    };

    expect(result).toEqual(expected);
  });
});

describe('VideoControlable', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should handle onTracksToggle', () => {
    const selectedTrack = expectedTracks[1].language;
    const component = renderer.create(
      <VideoControlable isFocused tracks={expectedTracks} selectedTrack={selectedTrack} />,
    );

    const video = component.root.find((el) => el.props.onTracksToggle);
    expect(video.props.selectedTrack).toEqual(selectedTrack);
    video.props.onTracksToggle();

    expect(video.props.selectedTrack).toBeUndefined();
  });

  it('should handle onError', () => {
    const component = renderer.create(<VideoControlable isFocused />);

    const video = component.root.find((el) => el.props.onError);
    video.props.onError();

    expect(video.props.step).toEqual(STEP.ERROR);
  });

  describe('onReady', () => {
    it('should seek the video', () => {
      Platform.OS = 'android';

      const ref = createRef();
      const component = renderer.create(<VideoControlable isFocused />);

      const video = component.root.find((el) => el.props.onReady);
      video.props.onRef(ref);
      video.props.onReady();

      expect(ref.seekTo).toHaveBeenCalledTimes(1);
      expect(ref.seekTo).toHaveBeenCalledWith(0);
    });

    it('should not seek the video', () => {
      Platform.OS = 'ios';

      const ref = createRef();
      const component = renderer.create(<VideoControlable isFocused />);

      const video = component.root.find((el) => el.props.onReady);
      video.props.onRef(ref);
      video.props.onReady();

      expect(ref.seekTo).toHaveBeenCalledTimes(0);
    });
  });

  it('should pause the video when focus is lost', () => {
    const ref = createRef();
    const component = renderer.create(<VideoControlable isFocused />);

    const video = component.root.find((el) => el.props.onRef);
    video.props.onRef(ref);

    component.update(<VideoControlable isFocused={false} />);

    expect(ref.methods.pause).toHaveBeenCalledTimes(1);
  });

  describe('onShrink', () => {
    it('should handle shrink (Android)', async () => {
      Platform.OS = 'android';

      const toggleFullscreen = jest.fn();
      const ref = createRef();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onShrink);
      video.props.onRef(ref);
      video.props.onProgress({currentTime});
      await video.props.onShrink();

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
      expect(toggleFullscreen).toHaveBeenCalledWith(false);
      expect(ref.seekTo).toHaveBeenCalledTimes(1);
      expect(ref.seekTo).toHaveBeenCalledWith(currentTime);
      expect(ref.player.ref.dismissFullscreenPlayer).toHaveBeenCalledTimes(1);
      expect(orientation.lockToPortrait).toHaveBeenCalledTimes(1);
    });

    it('should handle shrink (iOS)', async () => {
      const toggleFullscreen = jest.fn();
      const ref = createRef();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onShrink);
      video.props.onRef(ref);
      video.props.onProgress({currentTime});
      await video.props.onShrink();

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
      expect(toggleFullscreen).toHaveBeenCalledWith(false);
      expect(ref.seekTo).toHaveBeenCalledTimes(0);
      expect(ref.player.ref.dismissFullscreenPlayer).toHaveBeenCalledTimes(1);
      expect(orientation.lockToPortrait).toHaveBeenCalledTimes(1);
    });

    it('should not handle shrink if no ref found', async () => {
      const toggleFullscreen = jest.fn();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onShrink);
      video.props.onProgress({currentTime});
      await video.props.onShrink();

      expect(toggleFullscreen).toHaveBeenCalledTimes(0);
      expect(orientation.lockToPortrait).toHaveBeenCalledTimes(0);
    });
  });

  describe('onExpand', () => {
    it('should handle expand (Android)', async () => {
      Platform.OS = 'android';

      const toggleFullscreen = jest.fn();
      const ref = createRef();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onExpand);
      video.props.onRef(ref);
      video.props.onProgress({currentTime});
      await video.props.onExpand();

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
      expect(toggleFullscreen).toHaveBeenCalledWith(true);
      expect(ref.seekTo).toHaveBeenCalledTimes(1);
      expect(ref.seekTo).toHaveBeenCalledWith(currentTime);
      expect(ref.player.ref.presentFullscreenPlayer).toHaveBeenCalledTimes(1);
      expect(orientation.unlockAllOrientations).toHaveBeenCalledTimes(1);
    });

    it('should handle expand (iOS)', async () => {
      const toggleFullscreen = jest.fn();
      const ref = createRef();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onExpand);
      video.props.onRef(ref);
      video.props.onProgress({currentTime});
      await video.props.onExpand();

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
      expect(toggleFullscreen).toHaveBeenCalledWith(true);
      expect(ref.seekTo).toHaveBeenCalledTimes(0);
      expect(ref.player.ref.presentFullscreenPlayer).toHaveBeenCalledTimes(1);
      expect(orientation.unlockAllOrientations).toHaveBeenCalledTimes(1);
    });

    it('should not handle expand if no ref found', async () => {
      const toggleFullscreen = jest.fn();
      const currentTime = 1337;
      const component = renderer.create(
        <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
      );

      const video = component.root.find((el) => el.props.onExpand);
      video.props.onProgress({currentTime});
      await video.props.onExpand();

      expect(toggleFullscreen).toHaveBeenCalledTimes(0);
      expect(orientation.unlockAllOrientations).toHaveBeenCalledTimes(0);
    });
  });

  it('should handle onEnd', async () => {
    const toggleFullscreen = jest.fn();
    const ref = createRef();
    const currentTime = 1337;
    const component = renderer.create(
      <VideoControlable isFocused toggleFullscreen={toggleFullscreen} />,
    );

    const video = component.root.find((el) => el.props.onEnd);
    video.props.onRef(ref);
    video.props.onProgress({currentTime});
    await video.props.onEnd();

    expect(video.props.step).toEqual(STEP.END);
    expect(toggleFullscreen).toHaveBeenCalledTimes(1);
    expect(toggleFullscreen).toHaveBeenCalledWith(false);
    expect(ref.seekTo).toHaveBeenCalledTimes(0);
    expect(ref.player.ref.dismissFullscreenPlayer).toHaveBeenCalledTimes(1);
    expect(orientation.lockToPortrait).toHaveBeenCalledTimes(1);
  });

  describe('onPlay', () => {
    it('should fetch tracks and seek current time', async () => {
      const fetchVideoUri = jest.fn();
      const fetchVideoTracks = jest.fn();
      const onPlay = jest.fn();
      const ref = createRef();
      const id = 'foo';
      const provider = VIDEO_PROVIDER.VIMEO;
      const component = renderer.create(
        <VideoControlable
          isFocused
          fetchVideoUri={fetchVideoUri}
          fetchVideoTracks={fetchVideoTracks}
          onPlay={onPlay}
          id={id}
          provider={provider}
        />,
      );

      const video = component.root.find((el) => el.props.onRef && el.props.onPlay);
      video.props.onRef(ref);
      await video.props.onPlay();

      expect(ref.seekTo).toHaveBeenCalledTimes(1);
      expect(ref.seekTo).toHaveBeenCalledWith(0);
      expect(fetchVideoUri).toHaveBeenCalledTimes(0);
      expect(fetchVideoTracks).toHaveBeenCalledTimes(0);
      expect(onPlay).toHaveBeenCalledTimes(1);
      expect(video.props.step).toEqual(STEP.PLAY);
    });

    it('should fetch uri', async () => {
      const fetchVideoUri = jest.fn();
      const fetchVideoTracks = jest.fn();
      const onPlay = jest.fn();
      const id = 'foo';
      const provider = VIDEO_PROVIDER.KONTIKI;
      const component = renderer.create(
        <VideoControlable
          isFocused
          fetchVideoUri={fetchVideoUri}
          fetchVideoTracks={fetchVideoTracks}
          onPlay={onPlay}
          id={id}
          provider={provider}
        />,
      );

      const video = component.root.find((el) => el.props.onRef && el.props.onPlay);
      await video.props.onPlay();

      expect(fetchVideoUri).toHaveBeenCalledTimes(1);
    });

    it('should fetch tracks', async () => {
      const fetchVideoUri = jest.fn();
      const fetchVideoTracks = jest.fn();
      const onPlay = jest.fn();
      const id = 'foo';
      const provider = VIDEO_PROVIDER.JWPLAYER;
      const component = renderer.create(
        <VideoControlable
          isFocused
          fetchVideoUri={fetchVideoUri}
          fetchVideoTracks={fetchVideoTracks}
          onPlay={onPlay}
          id={id}
          provider={provider}
        />,
      );

      const video = component.root.find((el) => el.props.onRef && el.props.onPlay);
      await video.props.onPlay();

      expect(fetchVideoTracks).toHaveBeenCalledTimes(1);
      expect(fetchVideoTracks).toHaveBeenCalledWith(id, VIDEO_TRACK_TYPE.VTT);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    Platform.OS = 'ios';
  });
});
