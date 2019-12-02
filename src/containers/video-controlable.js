// @flow

import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {fetchVideoUri} from '@coorpacademy/player-store';
import type {VideoProvider} from '@coorpacademy/player-store';
import orientation from 'react-native-orientation-locker';
// @@todo wait for support tablet landscape orientation
// import DeviceInfo from 'react-native-device-info';

import Video, {STEP} from '../components/video';
import type {Metadata, Step} from '../components/video';
import VideoHotspot from '../components/video-hotspot';
import {toggleFullscreen} from '../redux/actions/video/full-screen';
import {__STORYBOOK__} from '../modules/environment';
import {VIDEO_PROVIDER} from '../layer/data/_const';

type ConnectedStateProps = {|
  isFullScreen: boolean,
  source?: {uri: string}
|};

type ConnectedDispatchToProps = {|
  toggleFullscreen: typeof toggleFullscreen,
  fetchVideoUri: typeof fetchVideoUri
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchToProps,
  source: File | {uri?: string},
  videoId: string,
  videoProvider: VideoProvider,
  preview: File | {uri: string},
  height: number,
  subtitles?: string,
  testID?: string,
  extralifeOverlay?: boolean,
  onStart?: () => void
|};

type State = {|
  step: Step,
  hasSubtitles: boolean
|};

class VideoControlable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    step: STEP.PREVIEW,
    hasSubtitles: true
  };

  videoPlayer: VideoPlayer | null;

  videoHotspot: VideoHotspot | null;

  currentTime: number = 0;

  isReady: boolean = false;

  toggleStart = async () => {
    const {videoId, videoProvider, onStart} = this.props;

    this.isReady = false;

    if (videoProvider === VIDEO_PROVIDER.KONTIKI) {
      await this.updateStep(STEP.LOADING);
      await this.props.fetchVideoUri(videoId, videoProvider);
    }

    onStart && onStart();

    this.handleSeekChange(0);
    this.togglePlayPause(true);
  };

  togglePlayPause = (isPlaying?: boolean) => {
    if (isPlaying) {
      this.videoHotspot && this.videoHotspot.play();
    } else {
      this.videoHotspot && this.videoHotspot.pause();
    }

    return this.updateStep(isPlaying ? STEP.PLAY : STEP.PAUSE);
  };

  updateStep = (step: Step) =>
    this.setState({
      step
    });

  toggleEnd = async () => {
    await this.handleFullscreenToggle(false);
    await this.handlePlayPauseToggle(false);
    await this.updateStep(STEP.END);
  };

  handleRef = (ref: VideoPlayer | null) => {
    this.videoPlayer = ref;
  };

  handleHotspotRef = (ref: VideoHotspot | null) => {
    this.videoHotspot = ref;
  };

  handleFullscreenToggle = (isEnabled: boolean) => async () => {
    await this.props.toggleFullscreen(isEnabled);

    if (isEnabled) {
      this.videoPlayer && this.videoPlayer.player.ref.presentFullscreenPlayer();
    } else {
      this.videoPlayer && this.videoPlayer.player.ref.dismissFullscreenPlayer();
    }
    if (Platform.OS === 'android' && this.currentTime) {
      this.handleSeekChange(this.currentTime);
    }

    if (isEnabled) {
      orientation.unlockAllOrientations();
    } else {
      // @@todo wait for support tablet landscape orientation
      // if (!DeviceInfo.isTablet()) {
      orientation.lockToPortrait();
      // }
    }
  };

  handlePlayPauseToggle = (isPlaying?: boolean) => () => this.togglePlayPause(isPlaying);

  handleProgress = (data?: {currentTime: number}) => {
    const {currentTime} = data || {};

    if (currentTime !== undefined) {
      this.currentTime = currentTime;
      this.videoHotspot && this.videoHotspot.updateTime({value: currentTime});
    }
  };

  handleStart = () => {
    this.toggleStart();
  };

  handleEnd = () => {
    this.toggleEnd();
  };

  handleReady = () => {
    // This is a hack to launch the video
    if (Platform.OS === 'android' && this.videoPlayer && !this.isReady) {
      this.isReady = true;
      this.handleSeekChange(0);
      this.videoHotspot && this.videoHotspot.setApiReady();
    }
  };

  handleLoad = ({naturalSize: {width, height}, duration, currentTime}: Metadata) => {
    this.videoHotspot &&
      this.videoHotspot.loadMetadata({
        duration,
        time: currentTime,
        width,
        height
      });
  };

  handleSubtitlesToggle = () =>
    this.setState(({hasSubtitles}: State) => ({
      hasSubtitles: !hasSubtitles
    }));

  handleError = () => {
    this.togglePlayPause(false);
    this.updateStep(STEP.ERROR);
  };

  handleSeekChange = (value: number) => {
    this.videoPlayer && this.videoPlayer.seekTo(value);
    this.videoHotspot && this.videoHotspot.seekTo({value});
  };

  // @todo
  handleVolumeChange = (volume: number) => {};

  // @todo
  handleMutedChange = (isMuted: boolean) => {};

  render() {
    return (
      <React.Fragment>
        {/*
        Should disable NavigationEvents when running  Storybook because of rn navigation incompatibility
         */}
        {!__STORYBOOK__ ? (
          <NavigationEvents onWillBlur={this.handlePlayPauseToggle(false)} />
        ) : null}
        <Video
          source={this.props.source}
          preview={this.props.preview}
          height={this.props.height}
          step={this.state.step}
          subtitles={this.props.subtitles}
          hasSubtitles={this.state.hasSubtitles}
          isFullScreen={this.props.isFullScreen}
          onStart={this.handleStart}
          onPlay={this.handlePlayPauseToggle(true)}
          onPause={this.handlePlayPauseToggle(false)}
          onSeekChange={this.handleSeekChange}
          onVolumeChange={this.handleVolumeChange}
          onMutedChange={this.handleMutedChange}
          onEnd={this.handleEnd}
          onReady={this.handleReady}
          onExpand={this.handleFullscreenToggle(true)}
          onShrink={this.handleFullscreenToggle(false)}
          onProgress={this.handleProgress}
          onSubtitlesToggle={this.handleSubtitlesToggle}
          onRef={this.handleRef}
          onHotspotRef={this.handleHotspotRef}
          onError={this.handleError}
          onLoad={this.handleLoad}
          testID={this.props.testID}
          extralifeOverlay={this.props.extralifeOverlay}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: StoreState, {videoId}: Props): ConnectedStateProps => {
  const {video, data} = state;
  const videoUrl = data.videos.entities[videoId];

  return {
    ...(videoUrl ? {source: {uri: videoUrl}} : {}),
    isFullScreen: video.isFullScreen
  };
};

const mapDispatchToProps: ConnectedDispatchToProps = {
  toggleFullscreen,
  fetchVideoUri
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlable);
